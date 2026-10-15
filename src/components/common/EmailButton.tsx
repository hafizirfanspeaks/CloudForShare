import { useState, type ReactNode } from 'react'
import EmailModal from './EmailModal'
import { COMPANY_EMAIL } from '@/lib/constants'

interface EmailButtonProps {
  children: ReactNode
  className?: string
  subject?: string
  body?: string
  title?: string
  onClick?: () => void
}

/**
 * Reusable button that opens EmailModal instead of direct mailto.
 * Works everywhere — no dependency on user having email client installed.
 */
export default function EmailButton({
  children,
  className,
  subject,
  body,
  title,
  onClick,
}: EmailButtonProps) {
  const [open, setOpen] = useState(false)

  const handleClick = () => {
    onClick?.()
    setOpen(true)
  }

  return (
    <>
      <button type="button" onClick={handleClick} className={className}>
        {children}
      </button>

      <EmailModal
        open={open}
        onClose={() => setOpen(false)}
        email={COMPANY_EMAIL}
        subject={subject}
        body={body}
        title={title}
      />
    </>
  )
}