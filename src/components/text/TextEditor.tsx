import { FileCode2, Type } from 'lucide-react'
import { useFileStore } from '@/store/fileStore'
import { cn } from '@/lib/utils/cn'
import type { TextLanguage } from '@/types/file'

const LANGUAGES: { value: TextLanguage; label: string }[] = [
  { value: 'plain', label: 'Plain Text' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
  { value: 'sql', label: 'SQL' },
  { value: 'bash', label: 'Bash / Shell' },
  { value: 'markdown', label: 'Markdown' },
]

export default function TextEditor() {
  const { textContent, setTextContent, textLanguage, setTextLanguage } =
    useFileStore()

  const lineCount = textContent.split('\n').length
  const charCount = textContent.length

  return (
    <div className="space-y-3">
      {/* Language selector */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1.5">
          <FileCode2 className="size-3.5" />
          Type:
        </span>
        {LANGUAGES.map((lang) => (
          <button
            key={lang.value}
            type="button"
            onClick={() => setTextLanguage(lang.value)}
            className={cn(
              'px-2.5 py-1 text-xs font-medium rounded-md border transition-all',
              textLanguage === lang.value
                ? 'bg-brand-500 text-white border-brand-500 shadow-sm'
                : 'bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
            )}
          >
            {lang.label}
          </button>
        ))}
      </div>

      {/* Textarea */}
      <div className="relative rounded-xl border border-gray-200 dark:border-gray-800 overflow-hidden bg-white dark:bg-gray-900 focus-within:border-brand-500 focus-within:ring-2 focus-within:ring-brand-100 dark:focus-within:ring-brand-900/30 transition-all">
        <div className="flex items-center justify-between px-3 py-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-950">
          <span className="text-xs font-medium text-gray-600 dark:text-gray-400 flex items-center gap-1.5">
            <Type className="size-3.5" />
            {LANGUAGES.find((l) => l.value === textLanguage)?.label}
          </span>
          <span className="text-xs text-gray-400 dark:text-gray-500">
            {lineCount} lines • {charCount} chars
          </span>
        </div>
        <textarea
          value={textContent}
          onChange={(e) => setTextContent(e.target.value)}
          placeholder={
            textLanguage === 'plain'
              ? 'Paste or type your text here...'
              : `// Paste your ${textLanguage} code here...`
          }
          className={cn(
            'w-full min-h-70 p-4 text-sm resize-y focus:outline-none bg-transparent',
            'text-gray-900 dark:text-white',
            'placeholder:text-gray-400 dark:placeholder:text-gray-500',
            textLanguage !== 'plain' && 'font-mono'
          )}
          spellCheck={false}
        />
      </div>

      <p className="text-xs text-gray-500 dark:text-gray-400">
        💡 Anyone with the link can view and copy this content. Perfect for
        sharing code, snippets, notes, or messages.
      </p>
    </div>
  )
}