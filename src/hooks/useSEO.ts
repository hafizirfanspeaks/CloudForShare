import { useEffect } from 'react'
import { APP_NAME } from '@/lib/constants'

interface UseSEOOptions {
  title: string
  description?: string
}

/**
 * Quick SEO helper for title and description.
 * For full control, use the <SEO /> component.
 */
export function useSEO({ title, description }: UseSEOOptions) {
  useEffect(() => {
    const fullTitle = `${title} | ${APP_NAME}`
    document.title = fullTitle

    if (description) {
      let meta = document.querySelector('meta[name="description"]')
      if (!meta) {
        meta = document.createElement('meta')
        meta.setAttribute('name', 'description')
        document.head.appendChild(meta)
      }
      meta.setAttribute('content', description)
    }
  }, [title, description])
}