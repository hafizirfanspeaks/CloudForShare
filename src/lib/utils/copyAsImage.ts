import { toBlob } from 'html-to-image'

/**
 * Convert an HTML element to PNG Blob.
 */
export async function elementToImageBlob(
  element: HTMLElement,
  options?: {
    backgroundColor?: string
    pixelRatio?: number
  }
): Promise<Blob | null> {
  try {
    const blob = await toBlob(element, {
      quality: 0.95,
      pixelRatio: options?.pixelRatio || 2,
      backgroundColor: options?.backgroundColor || '#ffffff',
      cacheBust: true,
    })
    return blob
  } catch (err) {
    console.error('Failed to generate image:', err)
    return null
  }
}

/**
 * Copy an HTML element as PNG to clipboard.
 */
export async function copyElementAsImage(
  element: HTMLElement,
  options?: { backgroundColor?: string }
): Promise<{ success: boolean; error: string | null }> {
  try {
    const blob = await elementToImageBlob(element, options)
    if (!blob) {
      return { success: false, error: 'Failed to generate image' }
    }

    // Try modern Clipboard API
    if (navigator.clipboard && typeof ClipboardItem !== 'undefined') {
      const item = new ClipboardItem({ 'image/png': blob })
      await navigator.clipboard.write([item])
      return { success: true, error: null }
    }

    return { success: false, error: 'Clipboard API not supported' }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Copy failed',
    }
  }
}

/**
 * Download an HTML element as PNG.
 */
export async function downloadElementAsImage(
  element: HTMLElement,
  filename: string,
  options?: { backgroundColor?: string }
): Promise<{ success: boolean; error: string | null }> {
  try {
    const blob = await elementToImageBlob(element, options)
    if (!blob) {
      return { success: false, error: 'Failed to generate image' }
    }

    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)

    return { success: true, error: null }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Download failed',
    }
  }
}