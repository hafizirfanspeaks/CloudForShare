import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { cn } from '@/lib/utils/cn'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export default function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div
      className={cn(
        'prose prose-sm md:prose-base dark:prose-invert max-w-none',
        'prose-headings:font-bold prose-headings:text-gray-900 dark:prose-headings:text-white',
        'prose-p:text-gray-700 dark:prose-p:text-gray-300',
        'prose-a:text-brand-600 dark:prose-a:text-brand-400 prose-a:no-underline hover:prose-a:underline',
        'prose-code:text-pink-600 dark:prose-code:text-pink-400 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none',
        'prose-pre:bg-gray-900 dark:prose-pre:bg-black prose-pre:text-gray-100',
        'prose-blockquote:border-l-4 prose-blockquote:border-brand-500 prose-blockquote:pl-4 prose-blockquote:italic',
        'prose-ul:list-disc prose-ol:list-decimal',
        'prose-table:border prose-table:border-gray-200 dark:prose-table:border-gray-800',
        'prose-th:bg-gray-50 dark:prose-th:bg-gray-900 prose-th:p-2 prose-th:text-left',
        'prose-td:border-t prose-td:border-gray-200 dark:prose-td:border-gray-800 prose-td:p-2',
        'prose-img:rounded-lg prose-img:shadow-md',
        'prose-hr:border-gray-200 dark:prose-hr:border-gray-800',
        className
      )}
    >
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ node, ...props }) => (
            <a {...props} target="_blank" rel="noopener noreferrer" />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}