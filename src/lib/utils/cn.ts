import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

/**
 * Merge Tailwind CSS classes with proper conflict resolution.
 * Usage: cn('px-4 py-2', isActive && 'bg-blue-500', 'text-white')
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}