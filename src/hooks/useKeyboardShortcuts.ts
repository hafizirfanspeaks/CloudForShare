import { useEffect } from 'react'

interface Shortcut {
  key: string // e.g., 'k', 's', 'n', '/'
  ctrl?: boolean
  shift?: boolean
  alt?: boolean
  meta?: boolean
  handler: (e: KeyboardEvent) => void
  preventDefault?: boolean
}

export function useKeyboardShortcuts(shortcuts: Shortcut[]) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Skip if user is typing in input/textarea (except for Escape)
      const target = e.target as HTMLElement
      const isTyping =
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable

      for (const s of shortcuts) {
        const keyMatches = e.key.toLowerCase() === s.key.toLowerCase()
        const ctrlMatches = !!s.ctrl === (e.ctrlKey || e.metaKey)
        const shiftMatches = !!s.shift === e.shiftKey
        const altMatches = !!s.alt === e.altKey

        if (keyMatches && ctrlMatches && shiftMatches && altMatches) {
          // Allow Escape and Ctrl+ shortcuts even while typing
          if (isTyping && !s.ctrl && e.key !== 'Escape') continue

          if (s.preventDefault !== false) {
            e.preventDefault()
          }
          s.handler(e)
          break
        }
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [shortcuts])
}