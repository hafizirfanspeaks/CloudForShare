import { Trash2 } from 'lucide-react'
import { useFileStore } from '@/store/fileStore'
import FileCard from './FileCard'
import { formatBytes } from '@/lib/utils/formatBytes'

export default function FileList() {
  const { files, clearFiles } = useFileStore()

  if (files.length === 0) return null

  const totalSize = files.reduce((sum, f) => sum + f.size, 0)

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
            {files.length} {files.length === 1 ? 'file' : 'files'} selected
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            Total: {formatBytes(totalSize)}
          </p>
        </div>
        <button
          type="button"
          onClick={clearFiles}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
        >
          <Trash2 className="size-3.5" />
          Clear all
        </button>
      </div>

      <div className="space-y-2">
        {files.map((file) => (
          <FileCard key={file.id} file={file} />
        ))}
      </div>
    </div>
  )
}