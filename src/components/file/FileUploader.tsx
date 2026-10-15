import { useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { UploadCloud } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { useFileStore } from '@/store/fileStore'
import { MAX_FILE_SIZE, MAX_FILES_PER_UPLOAD } from '@/lib/constants'
import { formatBytes } from '@/lib/utils/formatBytes'

interface FileUploaderProps {
  disabled?: boolean
}

export default function FileUploader({ disabled }: FileUploaderProps) {
  const { files, addFiles } = useFileStore()
  const remainingSlots = MAX_FILES_PER_UPLOAD - files.length

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: any[]) => {
      if (remainingSlots <= 0) return
      addFiles(acceptedFiles.slice(0, remainingSlots))

      if (rejectedFiles.length > 0) {
        const reasons = rejectedFiles.map((r) => r.errors[0]?.message).join(', ')
        console.warn('Rejected files:', reasons)
      }
    },
    [addFiles, remainingSlots]
  )

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    onDrop,
    maxSize: MAX_FILE_SIZE,
    maxFiles: remainingSlots,
    disabled: disabled || remainingSlots <= 0,
  })

  return (
    <div
      {...getRootProps()}
      className={cn(
        'relative flex flex-col items-center justify-center w-full min-h-70 rounded-2xl border-2 border-dashed transition-all cursor-pointer',
        'bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800/50',
        isDragActive &&
          !isDragReject &&
          'border-brand-500 bg-brand-50 dark:bg-brand-950/30 scale-[1.01]',
        isDragReject && 'border-red-400 bg-red-50 dark:bg-red-950/30',
        !isDragActive && 'border-gray-300 dark:border-gray-700',
        (disabled || remainingSlots <= 0) && 'opacity-50 cursor-not-allowed'
      )}
    >
      <input {...getInputProps()} />

      <div className="flex flex-col items-center text-center px-6 py-10 pointer-events-none">
        <div
          className={cn(
            'size-16 rounded-2xl flex items-center justify-center mb-5 transition-transform',
            isDragActive
              ? 'bg-brand-500 text-white scale-110'
              : 'bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400'
          )}
        >
          <UploadCloud className="size-8" strokeWidth={2} />
        </div>

        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1.5">
          {isDragActive
            ? 'Drop files here'
            : remainingSlots <= 0
              ? 'Maximum files reached'
              : 'Drag & drop files here'}
        </h3>

        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          or{' '}
          <span className="text-brand-600 dark:text-brand-400 font-medium underline underline-offset-2">
            browse from your device
          </span>
        </p>

        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs text-gray-400 dark:text-gray-500">
          <span>Max {formatBytes(MAX_FILE_SIZE)} per file</span>
          <span className="hidden sm:inline">•</span>
          <span>Up to {MAX_FILES_PER_UPLOAD} files</span>
          <span className="hidden sm:inline">•</span>
          <span>Any file type</span>
        </div>
      </div>
    </div>
  )
}