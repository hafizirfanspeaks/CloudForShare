import { format, formatDistanceToNow, differenceInDays } from 'date-fns'

/**
 * Format date in readable format.
 */
export function formatDate(date: string | Date): string {
  return format(new Date(date), 'MMM d, yyyy')
}

/**
 * Format date + time.
 */
export function formatDateTime(date: string | Date): string {
  return format(new Date(date), 'MMM d, yyyy • h:mm a')
}

/**
 * Time ago format ("2 hours ago").
 */
export function timeAgo(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

/**
 * Check if link is expired.
 */
export function isExpired(expiresAt: string | Date | null): boolean {
  if (!expiresAt) return false
  return new Date(expiresAt) < new Date()
}

/**
 * Days remaining until expiry.
 */
export function daysUntilExpiry(expiresAt: string | Date): number {
  return differenceInDays(new Date(expiresAt), new Date())
}