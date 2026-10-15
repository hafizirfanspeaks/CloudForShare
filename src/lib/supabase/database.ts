import { supabase } from './client'
import type { DatabaseShare, ShareWithFiles } from '@/types/supabase'

// =====================================================
// Password hashing
// =====================================================
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + 'cloudforshare-salt')
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

// =====================================================
// Slug generator
// =====================================================
function generateSlug(): string {
  const chars =
    'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const array = new Uint8Array(8)
  crypto.getRandomValues(array)
  return Array.from(array, (b) => chars[b % chars.length]).join('')
}

// =====================================================
// Create Share
// =====================================================
export async function createShare(params: {
  slug?: string
  password?: string
  expiresInHours: number
  downloadLimit: number
  content?: string
  contentType?: 'file' | 'text' | 'code'
}): Promise<{ share: DatabaseShare | null; error: string | null }> {
  try {
    const {
      slug,
      password,
      expiresInHours,
      downloadLimit,
      content,
      contentType = 'file',
    } = params

    const expiresAt =
      expiresInHours > 0
        ? new Date(Date.now() + expiresInHours * 60 * 60 * 1000).toISOString()
        : null

    const passwordHash = password ? await hashPassword(password) : null
    const finalSlug = slug || generateSlug()

    const { data, error } = await supabase
      .from('shares')
      .insert({
        slug: finalSlug,
        password_hash: passwordHash,
        expires_at: expiresAt,
        download_limit: downloadLimit,
        content: content || null,
        content_type: contentType,
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return {
          share: null,
          error: 'This custom link is already taken. Try another one.',
        }
      }
      return { share: null, error: error.message }
    }
    return { share: data, error: null }
  } catch (err) {
    return {
      share: null,
      error: err instanceof Error ? err.message : 'Failed to create share',
    }
  }
}

// =====================================================
// Create File Records
// =====================================================
export async function createFileRecords(
  shareId: string,
  files: { name: string; size: number; mimeType: string; storagePath: string }[]
): Promise<{ success: boolean; error: string | null }> {
  try {
    const records = files.map((f) => ({
      share_id: shareId,
      name: f.name,
      size: f.size,
      mime_type: f.mimeType,
      storage_path: f.storagePath,
    }))
    const { error } = await supabase.from('files').insert(records)
    if (error) return { success: false, error: error.message }
    return { success: true, error: null }
  } catch (err) {
    return {
      success: false,
      error:
        err instanceof Error ? err.message : 'Failed to save file records',
    }
  }
}

// =====================================================
// Get Share by slug or ID
// =====================================================
export async function getShare(
  identifier: string
): Promise<{ share: ShareWithFiles | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('shares')
      .select('*, files(*)')
      .or(`slug.eq.${identifier},id.eq.${identifier}`)
      .maybeSingle()

    if (error) return { share: null, error: error.message }
    if (!data) return { share: null, error: 'Share not found' }
    return { share: data as ShareWithFiles, error: null }
  } catch (err) {
    return {
      share: null,
      error: err instanceof Error ? err.message : 'Failed to fetch share',
    }
  }
}

// =====================================================
// Verify Password
// =====================================================
export async function verifyPassword(
  share: DatabaseShare,
  password: string
): Promise<boolean> {
  if (!share.password_hash) return true
  const hash = await hashPassword(password)
  return hash === share.password_hash
}

// =====================================================
// Check Share Validity
// =====================================================
export function isShareValid(share: DatabaseShare): {
  valid: boolean
  reason?: string
} {
  if (!share.is_active)
    return { valid: false, reason: 'This share has been deactivated' }
  if (share.expires_at && new Date(share.expires_at) < new Date())
    return { valid: false, reason: 'This share has expired' }
  if (share.download_limit > 0 && share.download_count >= share.download_limit)
    return { valid: false, reason: 'Download limit reached' }
  return { valid: true }
}

// =====================================================
// Increment download count
// =====================================================
export async function incrementDownloadCount(shareId: string): Promise<void> {
  try {
    await supabase.rpc('increment_download_count', { share_uuid: shareId })
  } catch (err) {
    console.error('Failed to increment download count:', err)
  }
}