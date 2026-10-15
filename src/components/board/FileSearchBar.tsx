import { Search, X, Image as ImageIcon, FileText, Film, Music, FileArchive } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export type FileFilter = 'all' | 'image' | 'text' | 'video' | 'audio' | 'archive'

interface FileSearchBarProps {
  search: string
  onSearchChange: (value: string) => void
  filter: FileFilter
  onFilterChange: (filter: FileFilter) => void
  totalCount: number
  filteredCount: number
}

const FILTERS: { value: FileFilter; label: string; icon: typeof Search }[] = [
  { value: 'all', label: 'All', icon: Search },
  { value: 'image', label: 'Images', icon: ImageIcon },
  { value: 'text', label: 'Text', icon: FileText },
  { value: 'video', label: 'Videos', icon: Film },
  { value: 'audio', label: 'Audio', icon: Music },
  { value: 'archive', label: 'Archives', icon: FileArchive },
]

export default function FileSearchBar({
  search,
  onSearchChange,
  filter,
  onFilterChange,
  totalCount,
  filteredCount,
}: FileSearchBarProps) {
  return (
    <div className="space-y-3">
      {/* Search input */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search files by name..."
          className={cn(
            'w-full h-11 rounded-lg border bg-white dark:bg-gray-900 pl-10 pr-10 text-sm transition-all',
            'text-gray-900 dark:text-white',
            'placeholder:text-gray-400 dark:placeholder:text-gray-500',
            'focus:outline-none focus:ring-2 focus:ring-offset-0',
            'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600',
            'focus:border-brand-500 focus:ring-brand-200 dark:focus:ring-brand-900/40'
          )}
        />
        {search && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 size-6 rounded-md flex items-center justify-center text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
            aria-label="Clear search"
          >
            <X className="size-3.5" />
          </button>
        )}
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map(({ value, label, icon: Icon }) => (
          <button
            key={value}
            type="button"
            onClick={() => onFilterChange(value)}
            className={cn(
              'inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border transition-all cursor-pointer active:scale-95',
              filter === value
                ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
            )}
          >
            <Icon className="size-3.5" />
            {label}
          </button>
        ))}

        {/* Result count */}
        <span className="text-xs text-gray-500 dark:text-gray-400 ml-auto">
          {filteredCount} of {totalCount}
        </span>
      </div>
    </div>
  )
}