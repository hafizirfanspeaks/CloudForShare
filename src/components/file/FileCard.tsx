import { X, FileText, Image as ImageIcon, Film, Music, FileArchive } from 'lucide-react'
import { cn } from '@/lib/utils/cn'
import { formatBytes, getFileExtension } from '@/lib/utils/formatBytes'
import { useFileStore } from '@/store/fileStore'
import type { UploadedFile } from '@/types/file'

interface FileCardProps {
  file: UploadedFile
  onRemove?: () => void
}

function FileIcon({ type, name }: { type: string; name: string }) {
  const ext = getFileExtension(name)
  const cls = 'size-5'

  if (type.startsWith('image/')) return <ImageIcon className={cls} />
  if (type.startsWith('video/')) return <Film className={cls} />
  if (type.startsWith('audio/')) return <Music className={cls} />
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext))
    return <FileArchive className={cls} />
  return <FileText className={cls} />
}

export default function FileCard({ file, onRemove }: FileCardProps) {
  const removeFile = useFileStore((s) => s.removeFile)
  const handleRemove = onRemove || (() => removeFile(file.id))

  return (
    <div className="group relative flex items-center gap-3 p-3 bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:shadow-sm transition-all">
      <div className="shrink-0 size-12 rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 dark:text-gray-400">
        {file.previewUrl ? (
          <img
            src={file.previewUrl}
            alt={file.name}
            className="size-full object-cover"
          />
        ) : (
          <FileIcon type={file.type} name={file.name} />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p
          className="text-sm font-medium text-gray-900 dark:text-white truncate"
          title={file.name}
        >
          {file.name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
          {formatBytes(file.size)}
          {file.status === 'uploading' && ` • ${file.progress}%`}
        </p>

        {file.status === 'uploading' && (
          <div className="mt-2 h-1 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-500 transition-all duration-300"
              style={{ width: `${file.progress}%` }}
            />
          </div>
        )}
      </div>

      <button
        type="button"
        onClick={handleRemove}
        className={cn(
          'shrink-0 size-8 rounded-lg flex items-center justify-center transition-colors',
          'text-gray-400 dark:text-gray-500 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/30'
        )}
        aria-label={`Remove ${file.name}`}
      >
        <X className="size-4" />
      </button>
    </div>
  )
}