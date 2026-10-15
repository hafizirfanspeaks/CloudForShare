import { MAX_FILE_SIZE, MAX_FILES_PER_UPLOAD } from '@/lib/constants'

// =====================================================
// File validation
// =====================================================

/**
 * Check if a file size is within the allowed limit.
 */
export function isValidFileSize(size: number): boolean {
  return size > 0 && size <= MAX_FILE_SIZE
}

/**
 * Check if the number of files is within the allowed limit.
 */
export function isValidFileCount(count: number): boolean {
  return count > 0 && count <= MAX_FILES_PER_UPLOAD
}

/**
 * Sanitize a filename by removing dangerous filesystem characters.
 * Preserves Unicode letters, numbers, dots, dashes, and underscores.
 */
export function sanitizeFilename(name: string): string {
  return name
    .replace(/[/\\:*?"<>|]/g, '_') // remove dangerous filesystem chars
    .replace(/\s+/g, ' ') // collapse multiple spaces
    .trim()
    .slice(0, 200) // limit length
}

// =====================================================
// Auth validation
// =====================================================

/**
 * Validate an email address format.
 */
export function isValidEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

/**
 * Validate a user account password.
 * Requirements: 8+ characters, at least 1 letter, 1 number.
 */
export function isValidPassword(password: string): boolean {
  return (
    password.length >= 8 &&
    /[a-zA-Z]/.test(password) &&
    /\d/.test(password)
  )
}

// =====================================================
// Share validation
// =====================================================

/**
 * Validate a share password.
 * Optional — if empty, considered valid. If provided, must be 4+ characters.
 */
export function isValidSharePassword(password: string): boolean {
  if (!password) return true
  return password.length >= 4
}

/**
 * Validate a custom share slug.
 * Optional — if empty, considered valid.
 * If provided: 3-50 chars, alphanumeric + dash + underscore only.
 */
export function isValidSlug(slug: string): boolean {
  if (!slug) return true
  return /^[a-zA-Z0-9_-]{3,50}$/.test(slug)
}