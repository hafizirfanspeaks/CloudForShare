import { useState } from 'react'
import { MessageCircle, Send, Mail, Share2 } from 'lucide-react'
import { notify } from '@/lib/toast'
import { cn } from '@/lib/utils/cn'

// =====================================================
// Custom SVG Brand Icons (lucide-react v1 removed them)
// =====================================================
const TwitterIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
)

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
)

const LinkedinIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
  </svg>
)

interface ShareButtonsProps {
  url: string
  title?: string
  text?: string
  compact?: boolean
}

export default function ShareButtons({
  url,
  title = 'CloudForShare Board',
  text = 'Check out this live board',
  compact = false,
}: ShareButtonsProps) {
  const [showMore, setShowMore] = useState(false)

  const encodedUrl = encodeURIComponent(url)
  const encodedText = encodeURIComponent(`${text} — ${url}`)

  const whatsappUrl = `https://wa.me/?text=${encodedText}`
  const telegramUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(text)}`
  const twitterUrl = `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodeURIComponent(text)}`
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
  const linkedinUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`
  const mailUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodedText}`

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, text, url })
        notify.success('Shared!')
      } catch {
        // user cancelled — silent
      }
    } else {
      await navigator.clipboard.writeText(url)
      notify.success('Link copied!', 'Your browser does not support native share')
    }
  }

  const buttons = [
    {
      label: 'WhatsApp',
      icon: MessageCircle,
      href: whatsappUrl,
      color: 'bg-green-500 hover:bg-green-600',
    },
    {
      label: 'Telegram',
      icon: Send,
      href: telegramUrl,
      color: 'bg-sky-500 hover:bg-sky-600',
    },
    {
      label: 'Twitter',
      icon: TwitterIcon,
      href: twitterUrl,
      color:
        'bg-gray-900 hover:bg-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600',
    },
    {
      label: 'Email',
      icon: Mail,
      href: mailUrl,
      color: 'bg-amber-500 hover:bg-amber-600',
    },
  ]

  const moreButtons = [
    {
      label: 'Facebook',
      icon: FacebookIcon,
      href: facebookUrl,
      color: 'bg-blue-600 hover:bg-blue-700',
    },
    {
      label: 'LinkedIn',
      icon: LinkedinIcon,
      href: linkedinUrl,
      color: 'bg-blue-700 hover:bg-blue-800',
    },
  ]

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={handleNativeShare}
          className={cn(
            'inline-flex items-center gap-2 h-10 px-4 rounded-lg font-medium text-sm text-white',
            'bg-linear-to-r from-brand-500 to-purple-600 hover:from-brand-600 hover:to-purple-700',
            'shadow-md shadow-brand-500/30 hover:shadow-lg hover:shadow-brand-500/40',
            'transition-all cursor-pointer active:scale-95'
          )}
        >
          <Share2 className="size-4" />
          <span>{compact ? 'Share' : 'Share Board'}</span>
        </button>

        {buttons.map(({ label, icon: Icon, href, color }) => (
          <a
            key={label}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(
              'inline-flex items-center gap-2 h-10 px-3 rounded-lg font-medium text-sm text-white',
              'shadow-sm transition-all cursor-pointer active:scale-95',
              color
            )}
            aria-label={`Share on ${label}`}
          >
            <Icon className="size-4" />
            <span className="hidden sm:inline">{label}</span>
          </a>
        ))}

        <button
          type="button"
          onClick={() => setShowMore((v) => !v)}
          className="inline-flex items-center justify-center h-10 w-10 rounded-lg font-medium text-sm text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-sm transition-all cursor-pointer active:scale-95"
          aria-label="More options"
        >
          <span className="text-lg leading-none font-bold">+</span>
        </button>
      </div>

      {showMore && (
        <div className="flex flex-wrap gap-2 animate-fade-in">
          {moreButtons.map(({ label, icon: Icon, href, color }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'inline-flex items-center gap-2 h-9 px-3 rounded-lg font-medium text-xs text-white',
                'shadow-sm transition-all cursor-pointer active:scale-95',
                color
              )}
            >
              <Icon className="size-3.5" />
              {label}
            </a>
          ))}
        </div>
      )}
    </div>
  )
}