import JSZip from 'jszip'
import { saveAs } from 'file-saver'
import { downloadBoardFile } from '@/lib/supabase/board'
import type { BoardFile } from '@/types/board'

interface DownloadProgress {
  current: number
  total: number
  fileName: string
}

/**
 * Download all board files as a ZIP.
 */
export async function downloadAllAsZip(
  files: BoardFile[],
  boardSlug: string,
  onProgress?: (progress: DownloadProgress) => void
): Promise<{ success: boolean; error: string | null }> {
  if (files.length === 0) {
    return { success: false, error: 'No files to download' }
  }

  try {
    const zip = new JSZip()
    const folder = zip.folder(`cloudforshare-${boardSlug}`) || zip

    let successCount = 0
    let failCount = 0

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      onProgress?.({
        current: i + 1,
        total: files.length,
        fileName: file.name,
      })

      const { blob, error } = await downloadBoardFile(file.storage_path)
      if (error || !blob) {
        failCount++
        continue
      }

      // Handle duplicate names — append number
      let fileName = file.name
      let counter = 1
      while (folder.file(fileName)) {
        const dotIndex = file.name.lastIndexOf('.')
        if (dotIndex > 0) {
          fileName = `${file.name.slice(0, dotIndex)}-${counter}${file.name.slice(dotIndex)}`
        } else {
          fileName = `${file.name}-${counter}`
        }
        counter++
      }

      folder.file(fileName, blob)
      successCount++
    }

    if (successCount === 0) {
      return { success: false, error: 'All downloads failed' }
    }

    // Generate ZIP (no progress callback — metadata was unused)
    const zipBlob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    })

    const timestamp = new Date().toISOString().slice(0, 10)
    saveAs(zipBlob, `cloudforshare-${boardSlug}-${timestamp}.zip`)

    if (failCount > 0) {
      return {
        success: true,
        error: `${successCount} of ${files.length} files added (${failCount} failed)`,
      }
    }

    return { success: true, error: null }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to create ZIP',
    }
  }
}

/**
 * Filter files by type.
 */
export function filterFileByType(
  file: BoardFile,
  filter: 'all' | 'image' | 'text' | 'video' | 'audio' | 'archive'
): boolean {
  if (filter === 'all') return true

  const mime = file.mime_type || ''
  const name = file.name.toLowerCase()

  switch (filter) {
    case 'image':
      return mime.startsWith('image/')
    case 'text':
      return (
        mime.startsWith('text/') ||
        name.endsWith('.txt') ||
        name.endsWith('.md') ||
        name.endsWith('.json') ||
        name.endsWith('.js') ||
        name.endsWith('.ts') ||
        name.endsWith('.css') ||
        name.endsWith('.html') ||
        name.endsWith('.xml') ||
        name.endsWith('.csv')
      )
    case 'video':
      return mime.startsWith('video/')
    case 'audio':
      return mime.startsWith('audio/')
    case 'archive':
      return (
        mime.includes('zip') ||
        mime.includes('rar') ||
        mime.includes('tar') ||
        mime.includes('7z') ||
        name.endsWith('.zip') ||
        name.endsWith('.rar') ||
        name.endsWith('.7z') ||
        name.endsWith('.tar') ||
        name.endsWith('.gz')
      )
    default:
      return true
  }
}