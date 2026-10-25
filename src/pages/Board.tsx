import { useEffect, useState, useRef, useCallback, useMemo } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Loader2,
  Copy,
  Check,
  Link as LinkIcon,
  Users,
  Zap,
  QrCode,
  Settings,
  Image as ImageIcon,
  ClipboardPaste,
  Package,
  Printer,
  ImageDown,
} from 'lucide-react'
import SEO from '@/components/seo/SEO'
import Button from '@/components/common/Button'
import BoardFileCard from '@/components/board/BoardFileCard'
import BoardUpload from '@/components/board/BoardUpload'
import BoardPasswordPrompt from '@/components/board/BoardPasswordPrompt'
import BoardSettings from '@/components/board/BoardSettings'
import FileSearchBar, { type FileFilter } from '@/components/board/FileSearchBar'
import OnboardingTour from '@/components/board/OnboardingTour'
import ShareButtons from '@/components/share/ShareButtons'
import QRCodeDisplay from '@/components/share/QRCodeDisplay'
import { SkeletonBoardPage } from '@/components/common/Skeleton'
import { supabase } from '@/lib/supabase/client'
import {
  createBoard,
  getBoardBySlug,
  getOrCreateBoard,
  updateBoardText,
  uploadBoardFile,
} from '@/lib/supabase/board'
import type { BoardWithFiles, BoardFile } from '@/types/board'
import { formatDateTime } from '@/lib/utils/date'
import { notify } from '@/lib/toast'
import { cn } from '@/lib/utils/cn'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'
import { useBoardView } from '@/hooks/useBoardView'
import { downloadAllAsZip, filterFileByType } from '@/lib/utils/zipDownload'
import { downloadElementAsImage } from '@/lib/utils/copyAsImage'

const TEXT_SAVE_DELAY = 800

interface BoardProps {
  forceNew?: boolean
}

export default function Board({ forceNew }: BoardProps = {}) {
  const { slug } = useParams<{ slug?: string }>()
  const navigate = useNavigate()

  const [board, setBoard] = useState<BoardWithFiles | null>(null)
  const [files, setFiles] = useState<BoardFile[]>([])
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)
  const [saving, setSaving] = useState(false)
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [showQR, setShowQR] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [unlocked, setUnlocked] = useState(false)
  const [dragging, setDragging] = useState(false)
  const [zipping, setZipping] = useState(false)
  const [zipProgress, setZipProgress] = useState({ current: 0, total: 0 })

  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<FileFilter>('all')

  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const textRef = useRef(text)
  const dragCounter = useRef(0)
  const boardRef = useRef<HTMLDivElement>(null)

  textRef.current = text

  useBoardView(board?.id || null)

  const filteredFiles = useMemo(() => {
    let result = files
    if (filter !== 'all') {
      result = result.filter((f) => filterFileByType(f, filter))
    }
    if (search.trim()) {
      const query = search.toLowerCase().trim()
      result = result.filter((f) => f.name.toLowerCase().includes(query))
    }
    return result
  }, [files, filter, search])

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)

      if (forceNew) {
        const { board: newBoard, error: createError } = await createBoard()
        if (cancelled) return
        if (createError || !newBoard) {
          setError(createError || 'Failed to create board')
          notify.error('Failed to create board', createError || undefined)
          setLoading(false)
          return
        }
        navigate(`/b/${newBoard.slug}`, { replace: true })
        return
      }

      if (!slug) {
        const { board: mainBoard, error: mainError } =
          await getOrCreateBoard('public')
        if (cancelled) return
        if (mainError || !mainBoard) {
          setError(mainError || 'Failed to load public board')
          notify.error('Failed to load board', mainError || undefined)
          setLoading(false)
          return
        }
        setBoard({ ...mainBoard, board_files: [] })
        setFiles([])
        setText(mainBoard.text_content || '')
        setUnlocked(true)
        setLoading(false)
        return
      }

      const { board: data, error: fetchError } = await getBoardBySlug(slug)
      if (cancelled) return

      if (fetchError || !data) {
        setError(fetchError || 'Board not found')
        notify.error('Board not found', 'The link may be invalid or deleted')
        setLoading(false)
        return
      }

      // ✅ Step 4 Fix: Public board kabhi expire nahi hoga
      if (slug !== 'public' && data.expires_at && new Date(data.expires_at) < new Date()) {
        setError('This board has expired')
        notify.error('Board expired', 'This board is no longer available')
        setLoading(false)
        return
      }

      setBoard(data)
      setFiles(data.board_files || [])
      setText(data.text_content || '')
      setUnlocked(!data.password_hash)
      setLoading(false)
    }

    load()
    return () => {
      cancelled = true
    }
  }, [slug, forceNew, navigate])

  useEffect(() => {
    if (!board || !unlocked) return

    const channel = supabase
      .channel(`board-${board.id}`)
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'boards', filter: `id=eq.${board.id}` },
        (payload) => {
          const newText = (payload.new as any).text_content || ''
          if (newText !== textRef.current) setText(newText)
        }
      )
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'board_files', filter: `board_id=eq.${board.id}` },
        (payload) => {
          const newFile = payload.new as BoardFile
          setFiles((prev) => {
            if (prev.some((f) => f.id === newFile.id)) return prev
            return [...prev, newFile]
          })
        }
      )
      .on(
        'postgres_changes',
        { event: 'DELETE', schema: 'public', table: 'board_files', filter: `board_id=eq.${board.id}` },
        (payload) => {
          const oldFile = payload.old as BoardFile
          setFiles((prev) => prev.filter((f) => f.id !== oldFile.id))
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [board, unlocked])

  const handleTextChange = useCallback(
    (value: string) => {
      setText(value)
      if (!board) return
      if (saveTimer.current) clearTimeout(saveTimer.current)
      setSaving(true)
      saveTimer.current = setTimeout(async () => {
        await updateBoardText(board.id, value)
        setSaving(false)
        setLastSaved(new Date())
      }, TEXT_SAVE_DELAY)
    },
    [board]
  )

  const handleFiles = useCallback(
    async (filesToUpload: File[]) => {
      if (!board || uploading) return
      setUploading(true)

      const toastId = notify.loading(
        `Uploading ${filesToUpload.length} file${filesToUpload.length === 1 ? '' : 's'}...`
      )

      let successCount = 0
      let failCount = 0

      for (const file of filesToUpload) {
        const { error: uploadError } = await uploadBoardFile(board.id, file)
        if (uploadError) failCount++
        else successCount++
      }

      notify.dismiss(toastId)
      setUploading(false)

      if (successCount > 0 && failCount === 0) {
        notify.success(`${successCount} file${successCount === 1 ? '' : 's'} uploaded`, 'Everyone on this board can see it now')
      } else if (failCount > 0 && successCount > 0) {
        notify.warning(`${successCount} uploaded, ${failCount} failed`)
      } else if (failCount > 0) {
        notify.error('Upload failed', 'Please try again')
      }
    },
    [board, uploading]
  )

  useEffect(() => {
    if (!board || !unlocked) return

    const handlePaste = async (e: ClipboardEvent) => {
      const target = e.target as HTMLElement
      if (target?.tagName === 'TEXTAREA' || target?.tagName === 'INPUT') return

      const items = e.clipboardData?.items
      if (!items) return

      const filesToUpload: File[] = []
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (item.kind === 'file') {
          const file = item.getAsFile()
          if (file) {
            const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-')
            const ext = file.type.split('/')[1] || 'png'
            const renamed = new File([file], `pasted-${timestamp}.${ext}`, { type: file.type })
            filesToUpload.push(renamed)
          }
        }
      }

      if (filesToUpload.length > 0) {
        e.preventDefault()
        notify.info('Pasted from clipboard', `Uploading ${filesToUpload.length} file(s)`)
        await handleFiles(filesToUpload)
      }
    }

    window.addEventListener('paste', handlePaste)
    return () => window.removeEventListener('paste', handlePaste)
  }, [board, unlocked, handleFiles])

  useEffect(() => {
    if (!board || !unlocked) return

    const onDragEnter = (e: DragEvent) => {
      e.preventDefault()
      dragCounter.current++
      if (e.dataTransfer?.types?.includes('Files')) setDragging(true)
    }
    const onDragLeave = (e: DragEvent) => {
      e.preventDefault()
      dragCounter.current--
      if (dragCounter.current === 0) setDragging(false)
    }
    const onDragOver = (e: DragEvent) => {
      e.preventDefault()
      if (e.dataTransfer) e.dataTransfer.dropEffect = 'copy'
    }
    const onDrop = async (e: DragEvent) => {
      e.preventDefault()
      dragCounter.current = 0
      setDragging(false)
      const droppedFiles = e.dataTransfer?.files
      if (!droppedFiles || droppedFiles.length === 0) return
      const fileArray = Array.from(droppedFiles)
      notify.info('Dropped!', `Uploading ${fileArray.length} file(s)`)
      await handleFiles(fileArray)
    }

    window.addEventListener('dragenter', onDragEnter)
    window.addEventListener('dragleave', onDragLeave)
    window.addEventListener('dragover', onDragOver)
    window.addEventListener('drop', onDrop)
    return () => {
      window.removeEventListener('dragenter', onDragEnter)
      window.removeEventListener('dragleave', onDragLeave)
      window.removeEventListener('dragover', onDragOver)
      window.removeEventListener('drop', onDrop)
    }
  }, [board, unlocked, handleFiles])

  const handleCopy = useCallback(async () => {
    const url = board?.slug === 'public' ? `${window.location.origin}/` : `${window.location.origin}/b/${board?.slug}`
    await navigator.clipboard.writeText(url)
    setCopied(true)
    notify.success('Link copied!', 'Share it with anyone')
    setTimeout(() => setCopied(false), 2000)
  }, [board])

  const handleDownloadZip = useCallback(async () => {
    if (!board || files.length === 0 || zipping) return
    setZipping(true)

    const toastId = notify.loading(`Preparing ${files.length} files...`)

    const { success, error: zipError } = await downloadAllAsZip(
      files,
      board.slug,
      (progress) => {
        setZipProgress({ current: progress.current, total: progress.total })
        notify.loading(`Downloading ${progress.current}/${progress.total}: ${progress.fileName}`, { id: toastId })
      }
    )

    notify.dismiss(toastId)
    setZipping(false)
    setZipProgress({ current: 0, total: 0 })

    if (success) {
      if (zipError) notify.warning('Partial download', zipError)
      else notify.success('ZIP downloaded!', 'All files are in the archive')
    } else {
      notify.error('Download failed', zipError || undefined)
    }
  }, [board, files, zipping])

  const handlePrint = useCallback(() => {
    window.print()
  }, [])

  const handleCopyAsImage = useCallback(async () => {
    if (!boardRef.current || !board) return
    const toastId = notify.loading('Generating image...')

    const { success, error } = await downloadElementAsImage(
      boardRef.current,
      `cloudforshare-${board.slug}-${Date.now()}.png`,
      { backgroundColor: document.documentElement.classList.contains('dark') ? '#030712' : '#ffffff' }
    )

    notify.dismiss(toastId)
    if (success) notify.success('Image downloaded!', 'Board saved as PNG')
    else notify.error('Failed to generate image', error || undefined)
  }, [board])

  useKeyboardShortcuts([
    { key: 'k', ctrl: true, handler: () => { const s = document.querySelector<HTMLInputElement>('input[placeholder*="Search files"]'); s?.focus(); s?.select(); } },
    { key: 'q', ctrl: true, handler: () => setShowQR((v) => !v) },
    { key: 'e', ctrl: true, shift: true, handler: () => setShowSettings(true) },
    { key: 'd', ctrl: true, shift: true, handler: () => handleDownloadZip() },
    { key: 'Escape', handler: () => { setShowQR(false); setShowSettings(false); } },
  ])

  if (loading) {
    return (
      <>
        <SEO title="Loading Board..." noindex />
        <SkeletonBoardPage />
      </>
    )
  }

  if (error && !board) {
    return (
      <div className="container-custom py-16 text-center">
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <Button onClick={() => navigate('/')}>Go to Public Board</Button>
      </div>
    )
  }

  if (!board) return null

  if (!unlocked && board.password_hash) {
    return <BoardPasswordPrompt board={board} onUnlock={() => setUnlocked(true)} />
  }

  const shareUrl = board.slug === 'public' ? `${window.location.origin}/` : `${window.location.origin}/b/${board.slug}`

  return (
    <>
      <SEO
        title="Live Board — Share Instantly"
        description="Paste text, add images and files instantly. Everyone with this link sees the same content in real time."
        url={board.slug === 'public' ? '/' : `/b/${board.slug}`}
        noindex
      />

      <OnboardingTour />

      {dragging && (
        <div className="fixed inset-0 z-100 bg-brand-500/20 dark:bg-brand-500/30 backdrop-blur-sm flex items-center justify-center pointer-events-none animate-fade-in">
          <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border-2 border-dashed border-brand-500 p-8 flex flex-col items-center">
            <div className="size-16 rounded-2xl bg-brand-50 dark:bg-brand-950/50 flex items-center justify-center mb-4">
              <ImageIcon className="size-8 text-brand-600 dark:text-brand-400" />
            </div>
            <p className="text-lg font-bold text-gray-900 dark:text-white">Drop files to upload</p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Release anywhere on the page</p>
          </div>
        </div>
      )}

      {showSettings && board && (
        <BoardSettings
          board={board}
          onClose={() => setShowSettings(false)}
          onUpdated={(updates) => setBoard((prev) => (prev ? { ...prev, ...updates } : prev))}
        />
      )}

      <div className="container-custom py-6 md:py-10" ref={boardRef}>
        <div className="max-w-4xl mx-auto space-y-5">
          <div className="flex flex-wrap items-center gap-3 no-print">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-950/40 border border-green-100 dark:border-green-900 text-xs font-medium text-green-700 dark:text-green-400">
              <span className="size-2 rounded-full bg-green-500 animate-pulse" />
              Live Board
            </div>
            <div className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
              <Users className="size-3.5" />
              {files.length} {files.length === 1 ? 'file' : 'files'}
            </div>
            {board.password_hash && (
              <div className="inline-flex items-center gap-1.5 text-xs text-amber-600 dark:text-amber-400">
                <Settings className="size-3.5" /> Password protected
              </div>
            )}
            {saving && (
              <div className="inline-flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400">
                <Loader2 className="size-3 animate-spin" /> Saving...
              </div>
            )}
            {!saving && lastSaved && (
              <div className="inline-flex items-center gap-1.5 text-xs text-green-600 dark:text-green-400">
                <Check className="size-3" /> Saved
              </div>
            )}
            <div className="flex-1" />
            <button type="button" onClick={handleCopyAsImage} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer" title="Copy board as image">
              <ImageDown className="size-3.5" />
              <span className="hidden sm:inline">Save as image</span>
            </button>
            <button type="button" onClick={handlePrint} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer" title="Print board">
              <Printer className="size-3.5" />
              <span className="hidden sm:inline">Print</span>
            </button>
            <button type="button" onClick={() => setShowSettings(true)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer" title="Ctrl+Shift+E">
              <Settings className="size-3.5" />
              <span className="hidden sm:inline">Settings</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 p-2 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 no-print">
            <LinkIcon className="size-4 text-gray-400 ml-2 shrink-0 hidden sm:block" />
            <input type="text" readOnly value={shareUrl} onClick={(e) => (e.target as HTMLInputElement).select()} className="flex-1 h-9 px-2 bg-transparent text-sm text-gray-700 dark:text-gray-300 font-mono focus:outline-none min-w-0 cursor-pointer" />
            <button type="button" onClick={() => setShowQR((v) => !v)} className={cn('inline-flex items-center gap-2 h-9 px-3 sm:px-4 rounded-lg font-semibold text-sm transition-all duration-150 shrink-0 cursor-pointer active:scale-95', showQR ? 'bg-purple-600 text-white hover:bg-purple-700 shadow-md shadow-purple-500/30' : 'bg-linear-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 shadow-md shadow-purple-500/30 hover:shadow-lg hover:shadow-purple-500/40')} title="Show QR code (Ctrl+Q)">
              <QrCode className="size-4 shrink-0" strokeWidth={2.5} />
              <span className="font-bold tracking-wide">QR</span>
            </button>
            <Button size="sm" variant={copied ? 'secondary' : 'primary'} onClick={handleCopy} leftIcon={copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}>
              {copied ? 'Copied!' : 'Copy link'}
            </Button>
          </div>

          <div className="no-print">
            <ShareButtons url={shareUrl} compact />
          </div>

          {showQR && (
            <div className="p-6 rounded-xl bg-linear-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30 border-2 border-purple-200 dark:border-purple-900 flex flex-col items-center animate-fade-in no-print">
              <div className="mb-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 dark:bg-purple-900/50 text-xs font-semibold text-purple-700 dark:text-purple-300">
                <QrCode className="size-3.5" /> Scan QR Code
              </div>
              <div className="p-4 bg-white rounded-2xl shadow-lg">
                <QRCodeDisplay value={shareUrl} size={240} />
              </div>
              <p className="mt-4 text-sm font-medium text-purple-700 dark:text-purple-300 text-center">Open your camera app and scan this code</p>
            </div>
          )}

          <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 no-print">
            <Zap className="size-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
            <div className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
              <strong>Live board.</strong> Type below, drag & drop files anywhere, or <kbd className="px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-900/50 font-mono text-[10px]">Ctrl+V</kbd> to paste images.
            </div>
          </div>

          <div className="rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 overflow-hidden focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100 dark:focus-within:ring-brand-900/30 transition-all">
            <textarea
              value={text}
              onChange={(e) => handleTextChange(e.target.value)}
              placeholder="Type or paste anything here... it saves automatically."
              className="w-full min-h-50 p-4 md:p-6 text-base text-gray-900 dark:text-white bg-transparent resize-y focus:outline-none font-mono placeholder:text-gray-400 dark:placeholder:text-gray-500"
              spellCheck={false}
            />
          </div>

          <div className="no-print">
            <BoardUpload onFiles={handleFiles} uploading={uploading} />
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-400 dark:text-gray-500 no-print">
            <ClipboardPaste className="size-3.5" />
            <span>Tip: Copy an image anywhere and press <kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono text-[10px]">Ctrl+V</kbd> to paste it here</span>
          </div>

          {error && (
            <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950/30 border border-red-100 dark:border-red-900 text-sm text-red-800 dark:text-red-300">{error}</div>
          )}

          {files.length > 0 && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Shared files ({files.length})</h3>
                <div className="no-print">
                  <Button size="sm" variant="outline" onClick={handleDownloadZip} loading={zipping} disabled={zipping || files.length === 0} leftIcon={!zipping ? <Package className="size-3.5" /> : undefined} title="Download all as ZIP (Ctrl+Shift+D)">
                    {zipping ? `Packing ${zipProgress.current}/${zipProgress.total}...` : 'Download all ZIP'}
                  </Button>
                </div>
              </div>

              <div className="no-print">
                <FileSearchBar search={search} onSearchChange={setSearch} filter={filter} onFilterChange={setFilter} totalCount={files.length} filteredCount={filteredFiles.length} />
              </div>

              {filteredFiles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {filteredFiles.map((file) => (
                    <BoardFileCard
                      key={file.id}
                      file={file}
                      onDeleted={(id) => {
                        setFiles((prev) => prev.filter((f) => f.id !== id))
                        notify.success('File deleted')
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 text-gray-400 dark:text-gray-500 border-2 border-dashed border-gray-200 dark:border-gray-800 rounded-xl">
                  <p className="text-sm">No files match your search. Try a different query or filter.</p>
                  <button type="button" onClick={() => { setSearch(''); setFilter('all'); }} className="mt-3 text-xs font-medium text-brand-600 dark:text-brand-400 hover:underline cursor-pointer">Clear filters</button>
                </div>
              )}
            </div>
          )}

          {files.length === 0 && !text && (
            <div className="text-center py-8 text-gray-400 dark:text-gray-500">
              <p className="text-sm">This board is empty. Type, drop a file, or paste an image to get started.</p>
            </div>
          )}

          <div className="pt-4 border-t border-gray-100 dark:border-gray-800 flex flex-wrap items-center justify-between gap-2 text-xs text-gray-400 dark:text-gray-500 no-print">
            <span>Board ID: {board.slug}</span>
            <span>Created {formatDateTime(board.created_at)}</span>
          </div>

          <div className="pt-2 text-xs text-gray-400 dark:text-gray-500 space-y-1 no-print">
            <p className="font-medium">Keyboard shortcuts:</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1">
              <span><kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono text-[10px]">Ctrl+K</kbd> Search</span>
              <span><kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono text-[10px]">Ctrl+Q</kbd> QR</span>
              <span><kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono text-[10px]">Ctrl+Shift+E</kbd> Settings</span>
              <span><kbd className="px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-800 font-mono text-[10px]">Ctrl+Shift+D</kbd> ZIP</span>
            </div>
          </div>

          {/* ✅ Step 2: Print/PDF Branding (Hidden on screen, visible on print) */}
          <div className="hidden print:block mt-12 pt-8 border-t border-gray-300">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">CloudForShare</h2>
              <p className="text-sm font-medium text-gray-700 mb-4">irfanzsolutions@gmail.com</p>
              <div className="text-xs text-gray-500 space-y-1">
                <p>Prepared by Irfanz Solutions</p>
                <p>© {new Date().getFullYear()} Irfanz Solutions. All rights reserved.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}