import { supabase } from './client'
import { STORAGE_BUCKET } from '@/lib/constants'
import { sanitizeFilename } from '@/lib/utils/validators'

export function generateStoragePath(shareId: string, filename: string): string {
  const timestamp = Date.now()
  const random = Math.random().toString(36).slice(2, 8)
  const sanitized = sanitizeFilename(filename)
  return `${shareId}/${timestamp}-${random}-${sanitized}`
}

export async function uploadFileToStorage(
  path: string,
  file: File,
  onProgress?: (progress: number) => void
): Promise<{ path: string; error: string | null }> {
  try {
    onProgress?.(10)
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || 'application/octet-stream',
      })
    if (error) return { path: '', error: error.message }
    onProgress?.(100)
    return { path: data.path, error: null }
  } catch (err) {
    return {
      path: '',
      error: err instanceof Error ? err.message : 'Upload failed',
    }
  }
}

export async function getFileUrl(
  path: string,
  expiresIn: number = 3600
): Promise<{ url: string | null; error: string | null }> {
  try {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .createSignedUrl(path, expiresIn)
    if (error) return { url: null, error: error.message }
    return { url: data.signedUrl, error: null }
  } catch (err) {
    return {
      url: null,
      error: err instanceof Error ? err.message : 'Failed to get URL',
    }
  }
}

export async function downloadFile(
  path: string
): Promise<{ blob: Blob | null; error: string | null }> {
  try {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .download(path)
    if (error) return { blob: null, error: error.message }
    return { blob: data, error: null }
  } catch (err) {
    return {
      blob: null,
      error: err instanceof Error ? err.message : 'Download failed',
    }
  }
}

export async function deleteFiles(
  paths: string[]
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase.storage.from(STORAGE_BUCKET).remove(paths)
    if (error) return { success: false, error: error.message }
    return { success: true, error: null }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Delete failed',
    }
  }
}