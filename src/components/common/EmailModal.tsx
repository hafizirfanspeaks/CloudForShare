import { useEffect, useState } from 'react'
import { X, Mail, Copy, Check, ExternalLink, Send } from 'lucide-react'
import { notify } from '@/lib/toast'
import { cn } from '@/lib/utils/cn'

interface EmailModalProps {
  open: boolean
  onClose: () => void
  email: string
  subject?: string
  body?: string
  title?: string
}

export default function EmailModal({
  open,
  onClose,
  email,
  subject = '',
  body = '',
  title = 'Contact us via email',
}: EmailModalProps) {
  const [copied, setCopied] = useState(false)

  // Close on Escape
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    if (open) {
      document.addEventListener('keydown', handleKey)
      document.body.style.overflow = 'hidden'
      return () => {
        document.removeEventListener('keydown', handleKey)
        document.body.style.overflow = ''
      }
    }
  }, [open, onClose])

  if (!open) return null

  const encodedSubject = encodeURIComponent(subject || 'Inquiry')
  const encodedBody = encodeURIComponent(body)

  // Direct Gmail compose URL
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}${
    subject ? `&su=${encodedSubject}` : ''
  }${body ? `&body=${encodedBody}` : ''}`

  // Default mail app (mailto)
  const mailtoUrl = `mailto:${email}?subject=${encodedSubject}${
    body ? `&body=${encodedBody}` : ''
  }`

  // Outlook web
  const outlookUrl = `https://outlook.live.com/mail/0/deeplink/compose?to=${email}${
    subject ? `&subject=${encodedSubject}` : ''
  }${body ? `&body=${encodedBody}` : ''}`

  // Yahoo web
  const yahooUrl = `https://compose.mail.yahoo.com/?to=${email}${
    subject ? `&subj=${encodedSubject}` : ''
  }${body ? `&body=${encodedBody}` : ''}`

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(email)
      setCopied(true)
      notify.success('Email copied!', email)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const el = document.createElement('textarea')
      el.value = email
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
      setCopied(true)
      notify.success('Email copied!', email)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleOpen = (url: string, label: string) => {
    window.open(url, '_blank', 'noopener,noreferrer')
    notify.success(`Opening ${label}...`)
    setTimeout(onClose, 400)
  }

  const options = [
    {
      id: 'gmail',
      label: 'Open in Gmail',
      sublabel: 'Compose in Gmail web',
      icon: 'gmail',
      url: gmailUrl,
      color: 'from-red-500 to-orange-500',
      hoverBorder: 'hover:border-red-300 dark:hover:border-red-800',
      hoverBg: 'hover:bg-red-50 dark:hover:bg-red-950/30',
      hoverText: 'group-hover:text-red-500',
    },
    {
      id: 'mailapp',
      label: 'Open Mail App',
      sublabel: 'Default email client',
      icon: 'send',
      url: mailtoUrl,
      color: 'from-brand-500 to-purple-600',
      hoverBorder: 'hover:border-brand-300 dark:hover:border-brand-800',
      hoverBg: 'hover:bg-brand-50 dark:hover:bg-brand-950/30',
      hoverText: 'group-hover:text-brand-500',
    },
    {
      id: 'outlook',
      label: 'Open in Outlook',
      sublabel: 'Compose in Outlook web',
      icon: 'mail',
      url: outlookUrl,
      color: 'from-blue-500 to-cyan-500',
      hoverBorder: 'hover:border-blue-300 dark:hover:border-blue-800',
      hoverBg: 'hover:bg-blue-50 dark:hover:bg-blue-950/30',
      hoverText: 'group-hover:text-blue-500',
    },
    {
      id: 'yahoo',
      label: 'Open in Yahoo Mail',
      sublabel: 'Compose in Yahoo web',
      icon: 'mail',
      url: yahooUrl,
      color: 'from-purple-500 to-pink-500',
      hoverBorder: 'hover:border-purple-300 dark:hover:border-purple-800',
      hoverBg: 'hover:bg-purple-50 dark:hover:bg-purple-950/30',
      hoverText: 'group-hover:text-purple-500',
    },
  ]

  return (
    <div
      className="fixed inset-0 z-100 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="email-modal-title"
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-900 shadow-2xl border border-gray-200 dark:border-gray-800 overflow-hidden animate-slide-up max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative bg-linear-to-br from-blue-600 via-purple-600 to-pink-600 p-6 text-white shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 size-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>

          <div className="flex items-center gap-3">
            <div className="size-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
              <Mail className="size-6 text-white" />
            </div>
            <div>
              <h3 id="email-modal-title" className="text-lg font-bold">
                {title}
              </h3>
              <p className="text-xs text-blue-100">
                Choose how you'd like to reach us
              </p>
            </div>
          </div>
        </div>

        {/* Body — scrollable */}
        <div className="p-5 overflow-y-auto flex-1">
          {/* Email display */}
          <div className="flex items-center gap-2 p-3 rounded-xl bg-linear-to-br from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border border-blue-100 dark:border-blue-900 mb-4">
            <div className="size-10 rounded-lg bg-white dark:bg-gray-900 flex items-center justify-center shrink-0 shadow-sm">
              <Mail className="size-4 text-brand-600 dark:text-brand-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] uppercase tracking-wider text-gray-500 dark:text-gray-400 font-bold">
                Email
              </p>
              <p className="text-sm font-bold text-gray-900 dark:text-white break-all">
                {email}
              </p>
            </div>
            <button
              type="button"
              onClick={handleCopy}
              className={cn(
                'size-9 rounded-lg flex items-center justify-center transition-all cursor-pointer active:scale-95 shrink-0',
                copied
                  ? 'bg-green-500 text-white'
                  : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-sm border border-gray-200 dark:border-gray-700'
              )}
              aria-label="Copy email"
              title="Copy email"
            >
              {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
            </button>
          </div>

          {/* Options */}
          <div className="space-y-2">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
              Open in
            </p>

            {options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleOpen(opt.url, opt.label)}
                className={cn(
                  'w-full flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 transition-all cursor-pointer active:scale-[0.98] group text-left',
                  opt.hoverBorder,
                  opt.hoverBg
                )}
              >
                <div
                  className={cn(
                    'size-10 rounded-lg bg-linear-to-br flex items-center justify-center shrink-0 shadow-sm group-hover:scale-110 transition-transform',
                    opt.color
                  )}
                >
                  {opt.icon === 'gmail' ? (
                    <svg
                      className="size-5 text-white"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M24 5.457v13.909c0 .904-.732 1.636-1.636 1.636h-3.819V11.73L12 16.64l-6.545-4.91v9.273H1.636A1.636 1.636 0 0 1 0 19.366V5.457c0-2.023 2.309-3.178 3.927-1.964L5.455 4.64 12 9.548l6.545-4.91 1.528-1.145C21.69 2.28 24 3.434 24 5.457z" />
                    </svg>
                  ) : opt.icon === 'send' ? (
                    <Send className="size-5 text-white" />
                  ) : (
                    <Mail className="size-5 text-white" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">
                    {opt.label}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {opt.sublabel}
                  </p>
                </div>
                <ExternalLink
                  className={cn(
                    'size-4 text-gray-400 transition-colors',
                    opt.hoverText
                  )}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 pb-5 shrink-0 border-t border-gray-100 dark:border-gray-800 pt-4">
          <div className="flex items-start gap-2 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800">
            <div className="size-4 rounded-full bg-brand-500 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-[10px] font-bold text-white">i</span>
            </div>
            <p className="text-[11px] text-gray-600 dark:text-gray-400 leading-relaxed">
              We typically respond within{' '}
              <strong className="text-gray-900 dark:text-white">24 hours</strong>
              . For urgent matters, please mention in subject line.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}