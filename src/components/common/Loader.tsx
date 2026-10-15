import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface LoaderProps {
  fullScreen?: boolean
  size?: number
  className?: string
}

export default function Loader({ fullScreen, size = 40, className }: LoaderProps) {
  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="animate-spin text-brand-500" size={size} />
      </div>
    )
  }

  return <Loader2 className={cn('animate-spin text-brand-500', className)} size={size} />
}