import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Plus,
  Loader2,
  FileText,
  FileCode2,
  Trash2,
  ExternalLink,
  Clock,
  Copy,
  Check,
} from 'lucide-react'
import SEO from '@/components/seo/SEO'
import Button from '@/components/common/Button'
import Card from '@/components/common/Card'
import { SkeletonBoardCard } from '@/components/common/Skeleton'
import { useAuth } from '@/hooks/useAuth'
import { getUserBoards, deleteBoard } from '@/lib/supabase/board'
import { timeAgo } from '@/lib/utils/date'
import { notify } from '@/lib/toast'
import type { BoardWithFiles } from '@/types/board'

export default function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [boards, setBoards] = useState<BoardWithFiles[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)

  // Load boards
  useEffect(() => {
    if (!user) return
    let cancelled = false

    async function load() {
      setLoading(true)
      const { boards: data, error: err } = await getUserBoards(user!.id)
      if (cancelled) return

      if (err) {
        setError(err)
        notify.error('Failed to load boards', err)
        setLoading(false)
        return
      }

      setBoards(data)
      setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [user])

  // Handle delete
  const handleDelete = async (boardId: string) => {
    if (!confirm('Delete this board? This cannot be undone.')) return
    setDeletingId(boardId)

    const { success, error: delError } = await deleteBoard(boardId)

    if (success) {
      setBoards((prev) => prev.filter((b) => b.id !== boardId))
      notify.success('Board deleted', 'The board has been removed')
    } else {
      notify.error('Delete failed', delError || undefined)
    }

    setDeletingId(null)
  }

  // Handle copy link
  const handleCopy = async (slug: string) => {
    await navigator.clipboard.writeText(`${window.location.origin}/b/${slug}`)
    setCopiedId(slug)
    notify.success('Link copied!', `/b/${slug}`)
    setTimeout(() => setCopiedId(null), 1500)
  }

  return (
    <>
      <SEO
        title="Dashboard"
        description="Manage all your CloudForShare boards in one place."
        url="/dashboard"
        noindex
      />

      <div className="container-custom py-10 md:py-14">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
                Your Boards
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {loading
                  ? 'Loading...'
                  : `${boards.length} ${boards.length === 1 ? 'board' : 'boards'}`}
              </p>
            </div>
            <Button
              onClick={() => navigate('/new')}
              leftIcon={<Plus className="size-4" />}
            >
              New Board
            </Button>
          </div>

          {/* Loading Skeleton */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SkeletonBoardCard />
              <SkeletonBoardCard />
              <SkeletonBoardCard />
              <SkeletonBoardCard />
            </div>
          )}

          {/* Error */}
          {error && !loading && (
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 text-sm text-red-800 dark:text-red-300 mb-6">
              {error}
            </div>
          )}

          {/* Empty state */}
          {!loading && boards.length === 0 && (
            <Card
              padding="lg"
              className="border border-gray-200 dark:border-gray-800 text-center py-16"
            >
              <div className="size-16 rounded-2xl bg-brand-50 dark:bg-brand-950/50 flex items-center justify-center mx-auto mb-5">
                <FileText className="size-8 text-brand-600 dark:text-brand-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No boards yet
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">
                Create your first board to get started
              </p>
              <Button
                onClick={() => navigate('/new')}
                leftIcon={<Plus className="size-4" />}
              >
                Create Board
              </Button>
            </Card>
          )}

          {/* Boards grid */}
          {!loading && boards.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {boards.map((board) => {
                const fileCount = board.board_files?.length || 0
                const textPreview =
                  board.text_content?.trim().slice(0, 120) || ''

                return (
                  <Card
                    key={board.id}
                    padding="md"
                    className="border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all hover:shadow-md"
                  >
                    {/* Header row */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="size-9 rounded-lg bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 flex items-center justify-center shrink-0">
                          {fileCount > 0 ? (
                            <FileText className="size-4" />
                          ) : (
                            <FileCode2 className="size-4" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-mono font-semibold text-gray-900 dark:text-white truncate">
                            /b/{board.slug}
                          </p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1">
                            <Clock className="size-3" />
                            {timeAgo(board.updated_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleCopy(board.slug)}
                          className="size-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors cursor-pointer"
                          title="Copy link"
                        >
                          {copiedId === board.slug ? (
                            <Check className="size-3.5 text-green-600 dark:text-green-400" />
                          ) : (
                            <Copy className="size-3.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(board.id)}
                          disabled={deletingId === board.id}
                          className="size-8 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center justify-center text-gray-400 dark:text-gray-500 hover:text-red-600 dark:hover:text-red-400 transition-colors cursor-pointer disabled:cursor-not-allowed"
                          title="Delete"
                        >
                          {deletingId === board.id ? (
                            <Loader2 className="size-3.5 animate-spin" />
                          ) : (
                            <Trash2 className="size-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Preview */}
                    {textPreview ? (
                      <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 mb-3 font-mono bg-gray-50 dark:bg-gray-950 p-2 rounded">
                        {textPreview}
                        {(board.text_content?.length || 0) > 120 && '...'}
                      </p>
                    ) : (
                      <p className="text-xs text-gray-400 dark:text-gray-500 italic mb-3">
                        Empty board
                      </p>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {fileCount} {fileCount === 1 ? 'file' : 'files'}
                      </span>
                      <a
                        href={`/b/${board.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-brand-600 dark:text-brand-400 hover:text-brand-700 dark:hover:text-brand-300 cursor-pointer"
                      >
                        <ExternalLink className="size-3" />
                        Open
                      </a>
                    </div>
                  </Card>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </>
  )
}