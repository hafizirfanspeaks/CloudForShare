import { useEffect, useState } from 'react'
import { Download, FileText, X, Loader2, Copy, Check } from 'lucide-react'
import { downloadBoardFile, deleteBoardFile } from '@/lib/supabase/board'
import { formatBytes } from '@/lib/utils/formatBytes'
import ConfirmModal from '@/components/common/ConfirmModal'
import type { BoardFile } from '@/types/board'

interface BoardFileCardProps {
  file: BoardFile
  onDeleted?: (id: string) => void
}

export default function BoardFileCard({ file, onDeleted }: BoardFileCardProps) {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [textPreview, setTextPreview] = useState<string | null>(null)
  const [downloading, setDownloading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false) // 👈 Naya state add kiya

  const isImage = file.mime_type?.startsWith('image/')
  const isText =
    file.mime_type?.startsWith('text/') ||
    file.name.endsWith('.txt') ||
    file.name.endsWith('.md') ||
    file.name.endsWith('.json') ||
    file.name.endsWith('.js') ||
    file.name.endsWith('.ts') ||
    file.name.endsWith('.css') ||
    file.name.endsWith('.html')

  useEffect(() => {
    let cancelled = false
    let objectUrl: string | null = null

    async function load() {
      if (!isImage && !isText) return
      const { blob } = await downloadBoardFile(file.storage_path)
      if (!blob || cancelled) return

      if (isImage) {
        objectUrl = URL.createObjectURL(blob)
        setImageUrl(objectUrl)
      } else if (isText) {
        const text = await blob.text()
        if (!cancelled) setTextPreview(text.slice(0, 2000))
      }
    }
    load()
    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [file.storage_path, isImage, isText])

  const handleDownload = async () => {
    setDownloading(true)
    const { blob } = await downloadBoardFile(file.storage_path)
    if (blob) {
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name
      a.click()
      URL.revokeObjectURL(url)
    }
    setDownloading(false)
  }

  const handleCopy = async () => {
    if (!textPreview) return
    await navigator.clipboard.writeText(textPreview)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  // 👈 Naya Delete Function jo Modal se trigger hoga
  const handleConfirmDelete = async () => {
    setDeleting(true)
    const { success } = await deleteBoardFile(file.id, file.storage_path)
    if (success) onDeleted?.(file.id)
    setDeleting(false)
    setShowDeleteModal(false)
  }

  return (
    <>
      <div className="group relative rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden hover:border-gray-300 dark:hover:border-gray-700 transition-all">
        <button
          type="button"
          onClick={() => setShowDeleteModal(true)} // 👈 Modal open karega
          disabled={deleting}
          className="absolute top-2 right-2 z-10 size-7 rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500 cursor-pointer"
          aria-label="Delete"
        >
          {deleting ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <X className="size-3.5" />
          )}
        </button>

        {isImage && imageUrl && (
          <div className="bg-gray-50 dark:bg-gray-950">
            <img
              src={imageUrl}
              alt={file.name}
              className="w-full h-48 object-contain"
              onClick={handleDownload}
              style={{ cursor: 'pointer' }}
            />
          </div>
        )}

        {isText && textPreview !== null && (
          <div className="relative bg-gray-50 dark:bg-gray-950 p-3">
            <pre className="text-xs text-gray-700 dark:text-gray-300 font-mono whitespace-pre-wrap wrap-break-word max-h-32 overflow-hidden">
              {textPreview}
              {textPreview.length >= 2000 && '...'}
            </pre>
            <button
              type="button"
              onClick={handleCopy}
              className="absolute top-2 right-2 size-7 rounded-md bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white cursor-pointer"
            >
              {copied ? (
                <Check className="size-3.5" />
              ) : (
                <Copy className="size-3.5" />
              )}
            </button>
          </div>
        )}

        {!isImage && !isText && (
          <div className="bg-gray-50 dark:bg-gray-950 py-8 flex items-center justify-center">
            <FileText className="size-10 text-gray-400 dark:text-gray-600" />
          </div>
        )}

        <div className="p-3 flex items-center gap-2">
          <div className="flex-1 min-w-0">
            <p
              className="text-xs font-medium text-gray-900 dark:text-white truncate"
              title={file.name}
            >
              {file.name}
            </p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">
              {formatBytes(file.size)}
            </p>
          </div>
          <button
            type="button"
            onClick={handleDownload}
            disabled={downloading}
            className="size-8 rounded-lg bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 flex items-center justify-center hover:bg-brand-100 dark:hover:bg-brand-900/50 transition-colors shrink-0 cursor-pointer"
          >
            {downloading ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Download className="size-3.5" />
            )}
          </button>
        </div>
      </div>

      {/* 👈 Professional Delete Modal */}
      <ConfirmModal
        open={showDeleteModal}
        title="Delete this file?"
        message={`Are you sure you want to delete "${file.name}"? This action cannot be undone.`}
        confirmText="Delete File"
        onConfirm={handleConfirmDelete}
        onCancel={() => setShowDeleteModal(false)}
        loading={deleting}
      />
    </>
  )
}