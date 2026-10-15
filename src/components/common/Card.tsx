import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils/cn'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'glass' | 'bordered'
  padding?: 'none' | 'sm' | 'md' | 'lg'
  hoverable?: boolean
  children: ReactNode
}

const variantClasses = {
  default: 'bg-white dark:bg-gray-900 shadow-sm',
  glass:
    'bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border border-white/20 dark:border-gray-800',
  bordered:
    'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800',
}

const paddingClasses = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
}

export default function Card({
  className,
  variant = 'default',
  padding = 'md',
  hoverable,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'rounded-xl',
        variantClasses[variant],
        paddingClasses[padding],
        hoverable &&
          'transition-all hover:shadow-lg hover:-translate-y-0.5 cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}