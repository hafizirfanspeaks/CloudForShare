import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import Button from '@/components/common/Button'
import { notify } from '@/lib/toast'

interface CopyButtonProps {
  value: string
  label?: string
  copiedLabel?: string
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  /** Optional: custom message shown in toast */
  toastMessage?: string
  /** Optional: hide toast */
  hideToast?: boolean
}

export default function CopyButton({
  value,
  label = 'Copy',
  copiedLabel = 'Copied!',
  variant = 'primary',
  size = 'md',
  fullWidth,
  toastMessage,
  hideToast = false,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    if (!value) {
      if (!hideToast) notify.error('Nothing to copy')
      return
    }

    try {
      // Modern Clipboard API (works on HTTPS and localhost)
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value)
      } else {
        // Fallback: use ClipboardItem if available
        if (typeof ClipboardItem !== 'undefined') {
          const blob = new Blob([value], { type: 'text/plain' })
          const item = new ClipboardItem({ 'text/plain': blob })
          await navigator.clipboard.write([item])
        } else {
          // Last resort: prompt user to copy manually
          window.prompt('Copy to clipboard: Ctrl+C, Enter', value)
        }
      }

      setCopied(true)
      if (!hideToast) {
        notify.success(toastMessage || 'Copied to clipboard!')
      }
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Copy failed:', err)
      if (!hideToast) {
        notify.error('Failed to copy', 'Please try again')
      }
    }
  }

  return (
    <Button
      onClick={handleCopy}
      variant={copied ? 'secondary' : variant}
      size={size}
      fullWidth={fullWidth}
      leftIcon={
        copied ? <Check className="size-4" /> : <Copy className="size-4" />
      }
    >
      {copied ? copiedLabel : label}
    </Button>
  )
}