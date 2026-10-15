import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Image as ImageIcon, Paperclip, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { MAX_FILE_SIZE } from '@/lib/constants'
import { compressImage, isCompressibleImage } from '@/lib/utils/imageCompression'
import { notify } from '@/lib/toast'
import { canUpload, recordUpload } from '@/lib/utils/rateLimit'

interface BoardUploadProps {
  onFiles: (files: File[]) => void
  uploading?: boolean
}

export default function BoardUpload({ onFiles, uploading }: BoardUploadProps) {
  const onDrop = useCallback(
    async (accepted: File[]) => {
      if (accepted.length === 0) return

      // Rate limit check
      const { allowed } = canUpload()
      if (!allowed) {
        notify.error('Rate limit reached', 'Try again in an hour')
        return
      }

      // Compress images
      const processed: File[] = []
      let compressed = 0

      for (const file of accepted) {
        if (isCompressibleImage(file)) {
          const c = await compressImage(file)
          if (c.size < file.size) {
            compressed++
            processed.push(c)
            continue
          }
        }
        processed.push(file)
      }

      if (compressed > 0) {
        notify.info(
          `${compressed} image${compressed === 1 ? '' : 's'} optimized`,
          'Faster upload'
        )
      }

      // Record upload
      for (let i = 0; i < processed.length; i++) recordUpload()

      onFiles(processed)
    },
    [onFiles]
  )

  const { getRootProps, getInputProps, open } = useDropzone({
    onDrop,
    maxSize: MAX_FILE_SIZE,
    multiple: true,
    noClick: true,
    noKeyboard: true,
    disabled: uploading,
  })

  return (
    <div {...getRootProps()} className="flex flex-wrap gap-2">
      <input {...getInputProps()} />

      <button
        type="button"
        onClick={open}
        disabled={uploading}
        className={cn(
          'inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed transition-all text-sm font-medium',
          uploading
            ? 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-gray-400 cursor-not-allowed'
            : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:border-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/30 hover:text-brand-700 dark:hover:text-brand-400 cursor-pointer'
        )}
      >
        {uploading ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          <Paperclip className="size-4" />
        )}
        {uploading ? 'Uploading...' : 'Attach file'}
      </button>

      <button
        type="button"
        onClick={open}
        disabled={uploading}
        className={cn(
          'inline-flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 border-dashed transition-all text-sm font-medium',
          uploading
            ? 'border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 text-gray-400 cursor-not-allowed'
            : 'border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 hover:border-brand-400 hover:bg-brand-50 dark:hover:bg-brand-950/30 hover:text-brand-700 dark:hover:text-brand-400 cursor-pointer'
        )}
      >
        <ImageIcon className="size-4" />
        Add image
      </button>
    </div>
  )
}