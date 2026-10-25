import { supabase } from './client'
import { STORAGE_BUCKET } from '@/lib/constants'
import { sanitizeFilename } from '@/lib/utils/validators'
import type { Board, BoardFile, BoardWithFiles } from '@/types/board'

// =====================================================
// Hash password (SHA-256)
// =====================================================
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(password + 'cloudforshare-board-salt')
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('')
}

// =====================================================
// Slug generator
// =====================================================
function generateSlug(): string {
  const chars = 'abcdefghijkmnpqrstuvwxyz23456789'
  const array = new Uint8Array(6)
  crypto.getRandomValues(array)
  return Array.from(array, (b) => chars[b % chars.length]).join('')
}

// =====================================================
// Create board (with options)
// =====================================================
export async function createBoard(options?: {
  slug?: string
  password?: string
  expiresInHours?: number
}): Promise<{ board: Board | null; error: string | null }> {
  try {
    const { data: authData } = await supabase.auth.getUser()
    const userId = authData.user?.id || null

    const slug = options?.slug || generateSlug()
    const passwordHash = options?.password
      ? await hashPassword(options.password)
      : null

    const expiresAt =
      options?.expiresInHours && options.expiresInHours > 0
        ? new Date(
            Date.now() + options.expiresInHours * 60 * 60 * 1000
          ).toISOString()
        : null

    const { data, error } = await supabase
      .from('boards')
      .insert({
        slug,
        text_content: '',
        user_id: userId,
        password_hash: passwordHash,
        expires_at: expiresAt,
        is_custom_slug: !!options?.slug,
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        return {
          board: null,
          error: 'This custom link is already taken. Try another.',
        }
      }
      return { board: null, error: error.message }
    }
    return { board: data, error: null }
  } catch (err) {
    return {
      board: null,
      error: err instanceof Error ? err.message : 'Failed to create board',
    }
  }
}

// =====================================================
// Get or create public/network board
// =====================================================
export async function getOrCreateBoard(slug: string): Promise<{
  board: Board | null
  error: string | null
}> {
  try {
    const { data: existing } = await supabase
      .from('boards')
      .select()
      .eq('slug', slug)
      .maybeSingle()

    if (existing) {
      // ✅ Network and Public boards never expire (unless manually deleted)
      if (slug !== 'public' && !slug.startsWith('network-') && existing.expires_at && new Date(existing.expires_at) < new Date()) {
        return { board: null, error: 'This board has expired' }
      }
      return { board: existing, error: null }
    }

    const { data: authData } = await supabase.auth.getUser()
    const userId = authData.user?.id || null

    // Network boards auto-expire in 24 hours to save database space
    const expiresAt = slug.startsWith('network-') 
      ? new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() 
      : null

    const { data, error } = await supabase
      .from('boards')
      .insert({ 
        slug, 
        text_content: '', 
        user_id: userId,
        expires_at: expiresAt
      })
      .select()
      .single()

    if (error) {
      if (error.code === '23505') {
        const { data: raceData } = await supabase
          .from('boards')
          .select()
          .eq('slug', slug)
          .single()
        return { board: raceData, error: null }
      }
      return { board: null, error: error.message }
    }
    return { board: data, error: null }
  } catch (err) {
    return {
      board: null,
      error: err instanceof Error ? err.message : 'Failed to load board',
    }
  }
}

// =====================================================
// Get board by slug
// =====================================================
export async function getBoardBySlug(
  slug: string
): Promise<{ board: BoardWithFiles | null; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('boards')
      .select('*, board_files(*)')
      .eq('slug', slug)
      .maybeSingle()

    if (error) return { board: null, error: error.message }
    if (!data) return { board: null, error: 'Board not found' }
    return { board: data as BoardWithFiles, error: null }
  } catch (err) {
    return {
      board: null,
      error: err instanceof Error ? err.message : 'Failed to fetch board',
    }
  }
}

// =====================================================
// Verify board password
// =====================================================
export async function verifyBoardPassword(
  board: Board,
  password: string
): Promise<boolean> {
  if (!board.password_hash) return true
  const hash = await hashPassword(password)
  return hash === board.password_hash
}

// =====================================================
// Set board password
// =====================================================
export async function setBoardPassword(
  boardId: string,
  password: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const hash = password ? await hashPassword(password) : null
    const { error } = await supabase
      .from('boards')
      .update({ password_hash: hash })
      .eq('id', boardId)
    if (error) return { success: false, error: error.message }
    return { success: true, error: null }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to set password',
    }
  }
}

// =====================================================
// Set board expiry
// =====================================================
export async function setBoardExpiry(
  boardId: string,
  expiresInHours: number
): Promise<{ success: boolean; error: string | null }> {
  try {
    const expiresAt =
      expiresInHours > 0
        ? new Date(Date.now() + expiresInHours * 60 * 60 * 1000).toISOString()
        : null
    const { error } = await supabase
      .from('boards')
      .update({ expires_at: expiresAt })
      .eq('id', boardId)
    if (error) return { success: false, error: error.message }
    return { success: true, error: null }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to set expiry',
    }
  }
}

// =====================================================
// Check slug availability
// =====================================================
export async function isSlugAvailable(slug: string): Promise<boolean> {
  const { data } = await supabase
    .from('boards')
    .select('id')
    .eq('slug', slug)
    .maybeSingle()
  return !data
}

// =====================================================
// Text/File operations
// =====================================================
export async function updateBoardText(
  boardId: string,
  textContent: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { error } = await supabase
      .from('boards')
      .update({ text_content: textContent })
      .eq('id', boardId)
    if (error) return { success: false, error: error.message }
    return { success: true, error: null }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to save',
    }
  }
}

export async function uploadBoardFile(
  boardId: string,
  file: File,
  onProgress?: (p: number) => void
): Promise<{ file: BoardFile | null; error: string | null }> {
  try {
    onProgress?.(10)
    const timestamp = Date.now()
    const random = Math.random().toString(36).slice(2, 8)
    const sanitized = sanitizeFilename(file.name)
    const storagePath = `boards/${boardId}/${timestamp}-${random}-${sanitized}`

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type || 'application/octet-stream',
      })

    if (uploadError) return { file: null, error: uploadError.message }
    onProgress?.(80)

    const { data, error: dbError } = await supabase
      .from('board_files')
      .insert({
        board_id: boardId,
        name: file.name,
        size: file.size,
        mime_type: file.type || null,
        storage_path: storagePath,
      })
      .select()
      .single()

    if (dbError) return { file: null, error: dbError.message }
    onProgress?.(100)
    return { file: data, error: null }
  } catch (err) {
    return {
      file: null,
      error: err instanceof Error ? err.message : 'Upload failed',
    }
  }
}

export async function deleteBoardFile(
  fileId: string,
  storagePath: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    await supabase.storage.from(STORAGE_BUCKET).remove([storagePath])
    const { error } = await supabase.from('board_files').delete().eq('id', fileId)
    if (error) return { success: false, error: error.message }
    return { success: true, error: null }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Delete failed',
    }
  }
}

export async function downloadBoardFile(
  storagePath: string
): Promise<{ blob: Blob | null; error: string | null }> {
  try {
    const { data, error } = await supabase.storage
      .from(STORAGE_BUCKET)
      .download(storagePath)
    if (error) return { blob: null, error: error.message }
    return { blob: data, error: null }
  } catch (err) {
    return {
      blob: null,
      error: err instanceof Error ? err.message : 'Download failed',
    }
  }
}

export async function deleteBoard(
  boardId: string
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { data: files } = await supabase
      .from('board_files')
      .select('storage_path')
      .eq('board_id', boardId)

    if (files && files.length > 0) {
      const paths = files.map((f) => f.storage_path)
      await supabase.storage.from(STORAGE_BUCKET).remove(paths)
    }

    const { error } = await supabase.from('boards').delete().eq('id', boardId)
    if (error) return { success: false, error: error.message }
    return { success: true, error: null }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Delete failed',
    }
  }
}

export async function getUserBoards(
  userId: string
): Promise<{ boards: BoardWithFiles[]; error: string | null }> {
  try {
    const { data, error } = await supabase
      .from('boards')
      .select('*, board_files(*)')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false })
    if (error) return { boards: [], error: error.message }
    return { boards: (data || []) as BoardWithFiles[], error: null }
  } catch (err) {
    return {
      boards: [],
      error: err instanceof Error ? err.message : 'Failed to load boards',
    }
  }
}