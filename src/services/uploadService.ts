import { useFileStore } from '@/store/fileStore'
import { createShare, createFileRecords } from '@/lib/supabase/database'
import { uploadFileToStorage, generateStoragePath } from '@/lib/supabase/storage'
import type { ShareResult } from '@/types/file'

export async function performUpload(): Promise<{
  result: ShareResult | null
  error: string | null
}> {
  const store = useFileStore.getState()
  const { files, settings, mode, textContent, textLanguage } = store

  // ===================== TEXT MODE =====================
  if (mode === 'text') {
    if (!textContent.trim()) {
      return { result: null, error: 'Please enter some text to share' }
    }

    const { share, error: shareError } = await createShare({
      slug: settings.customSlug || undefined,
      password: settings.password || undefined,
      expiresInHours: settings.expiresInHours,
      downloadLimit: settings.downloadLimit,
      content: textContent,
      contentType: textLanguage === 'plain' ? 'text' : 'code',
    })

    if (shareError || !share) {
      return { result: null, error: shareError || 'Failed to create share' }
    }

    const slugOrId = share.slug || share.id
    const result: ShareResult = {
      id: share.id,
      shareUrl: `${window.location.origin}/share/${slugOrId}`,
      qrCode: '',
      expiresAt: share.expires_at,
      downloadLimit: share.download_limit,
      hasPassword: !!share.password_hash,
      contentType: share.content_type,
      files: [],
    }
    return { result, error: null }
  }

  // ===================== FILE MODE =====================
  if (files.length === 0) return { result: null, error: 'No files to upload' }

  try {
    const { share, error: shareError } = await createShare({
      slug: settings.customSlug || undefined,
      password: settings.password || undefined,
      expiresInHours: settings.expiresInHours,
      downloadLimit: settings.downloadLimit,
      contentType: 'file',
    })

    if (shareError || !share) {
      return { result: null, error: shareError || 'Failed to create share' }
    }

    const shareId = share.id
    const uploadedFiles: {
      name: string
      size: number
      type: string
      storagePath: string
    }[] = []

    for (const fileItem of files) {
      store.updateFile(fileItem.id, { status: 'uploading', progress: 0 })
      const storagePath = generateStoragePath(shareId, fileItem.name)
      const { path, error } = await uploadFileToStorage(
        storagePath,
        fileItem.file,
        (progress) => store.updateFile(fileItem.id, { progress })
      )

      if (error) {
        store.updateFile(fileItem.id, { status: 'error', error })
        return { result: null, error: `Upload failed: ${error}` }
      }

      store.updateFile(fileItem.id, { status: 'success', progress: 100 })
      uploadedFiles.push({
        name: fileItem.name,
        size: fileItem.size,
        type: fileItem.type,
        storagePath: path,
      })
    }

    const { success, error: recordError } = await createFileRecords(
      shareId,
      uploadedFiles.map((f) => ({
        name: f.name,
        size: f.size,
        mimeType: f.type,
        storagePath: f.storagePath,
      }))
    )

    if (!success) {
      return { result: null, error: recordError || 'Failed to save file records' }
    }

    const slugOrId = share.slug || shareId
    const result: ShareResult = {
      id: shareId,
      shareUrl: `${window.location.origin}/share/${slugOrId}`,
      qrCode: '',
      expiresAt: share.expires_at,
      downloadLimit: share.download_limit,
      hasPassword: !!share.password_hash,
      contentType: 'file',
      files: uploadedFiles.map((f) => ({
        name: f.name,
        size: f.size,
        type: f.type,
        url: f.storagePath,
      })),
    }
    return { result, error: null }
  } catch (err) {
    return {
      result: null,
      error: err instanceof Error ? err.message : 'Upload failed',
    }
  }
}