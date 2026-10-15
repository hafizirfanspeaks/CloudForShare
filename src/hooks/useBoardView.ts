import { useEffect } from 'react'
import { supabase } from '@/lib/supabase/client'

/**
 * Track board view (once per session per board).
 */
export function useBoardView(boardId: string | null) {
  useEffect(() => {
    if (!boardId) return

    const key = `viewed-${boardId}`
    if (sessionStorage.getItem(key)) return

    const recordView = async () => {
      try {
        const ua = navigator.userAgent.slice(0, 100)
        await supabase.from('board_views').insert({
          board_id: boardId,
          user_agent: ua,
        })
        sessionStorage.setItem(key, 'true')
      } catch (err) {
        console.debug('View tracking failed:', err)
      }
    }

    const timer = setTimeout(recordView, 2000)
    return () => clearTimeout(timer)
  }, [boardId])
}