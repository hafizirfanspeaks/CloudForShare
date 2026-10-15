/**
 * Generate a short unique ID for share links.
 * Uses crypto.getRandomValues for security.
 */
export function generateShareId(length: number = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  const array = new Uint8Array(length)
  crypto.getRandomValues(array)
  return Array.from(array, (byte) => chars[byte % chars.length]).join('')
}

/**
 * Generate a longer ID with prefix (for internal use).
 */
export function generateId(prefix: string = 'id'): string {
  return `${prefix}_${Date.now()}_${generateShareId(6)}`
}