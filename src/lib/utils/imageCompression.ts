import imageCompression from 'browser-image-compression'

/**
 * Compress an image file before upload.
 * Skips if not an image or already small.
 */
export async function compressImage(
  file: File,
  onProgress?: (progress: number) => void
): Promise<File> {
  // Skip if not an image
  if (!file.type.startsWith('image/')) return file

  // Skip GIF (animated)
  if (file.type === 'image/gif') return file

  // Skip if already small (< 500 KB)
  if (file.size < 500 * 1024) return file

  try {
    const compressed = await imageCompression(file, {
      maxSizeMB: 1, // Max 1 MB after compression
      maxWidthOrHeight: 1920, // Max 1920px
      useWebWorker: true,
      initialQuality: 0.85,
      onProgress: (p) => onProgress?.(p),
    })

    // If compression made it bigger (rare), return original
    if (compressed.size >= file.size) return file

    // Preserve original filename
    return new File([compressed], file.name, {
      type: compressed.type,
      lastModified: Date.now(),
    })
  } catch (err) {
    console.warn('Image compression failed, using original:', err)
    return file
  }
}

/**
 * Check if file is a compressible image.
 */
export function isCompressibleImage(file: File): boolean {
  if (!file.type.startsWith('image/')) return false
  if (file.type === 'image/gif') return false
  if (file.type === 'image/svg+xml') return false
  return file.size > 500 * 1024
}