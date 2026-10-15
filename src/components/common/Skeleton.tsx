import { cn } from '@/lib/utils/cn'

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-gray-200 dark:bg-gray-800',
        className
      )}
    />
  )
}

// Text skeleton (multiple lines)
export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          className={cn('h-4', i === lines - 1 ? 'w-3/5' : 'w-full')}
        />
      ))}
    </div>
  )
}

// File card skeleton
export function SkeletonFileCard() {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden">
      <Skeleton className="w-full h-48" />
      <div className="p-3 space-y-2">
        <Skeleton className="h-3 w-3/4" />
        <Skeleton className="h-2 w-1/3" />
      </div>
    </div>
  )
}

// Board card skeleton
export function SkeletonBoardCard() {
  return (
    <div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 space-y-3">
      <div className="flex items-center gap-3">
        <Skeleton className="size-9 rounded-lg" />
        <div className="flex-1 space-y-1.5">
          <Skeleton className="h-4 w-2/3" />
          <Skeleton className="h-3 w-1/3" />
        </div>
      </div>
      <Skeleton className="h-10 w-full" />
      <div className="flex justify-between">
        <Skeleton className="h-3 w-1/4" />
        <Skeleton className="h-3 w-1/6" />
      </div>
    </div>
  )
}

// Board page skeleton
export function SkeletonBoardPage() {
  return (
    <div className="container-custom py-6 md:py-10">
      <div className="max-w-4xl mx-auto space-y-5">
        <div className="flex items-center gap-3">
          <Skeleton className="h-7 w-24 rounded-full" />
          <Skeleton className="h-4 w-20" />
        </div>
        <Skeleton className="h-14 w-full rounded-xl" />
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-40 w-full rounded-xl" />
        <div className="flex gap-2">
          <Skeleton className="h-11 w-32 rounded-lg" />
          <Skeleton className="h-11 w-32 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <SkeletonFileCard key={i} />
          ))}
        </div>
      </div>
    </div>
  )
}