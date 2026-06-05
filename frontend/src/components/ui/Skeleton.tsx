import { cn } from '@/lib/cn'
import type { HTMLAttributes } from 'react'

type SkeletonProps = HTMLAttributes<HTMLDivElement>

export function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-xl border border-border/30 bg-muted/50',
        className,
      )}
      {...props}
    />
  )
}
