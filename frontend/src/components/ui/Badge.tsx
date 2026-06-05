import { cn } from '@/lib/cn'
import type { HTMLAttributes } from 'react'

type BadgeVariant = 'default' | 'secondary' | 'outline' | 'muted'

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-primary/10 text-primary border border-primary/20',
  secondary: 'bg-secondary text-secondary-foreground border border-border/50',
  outline: 'bg-transparent text-foreground border border-border/60',
  muted: 'bg-muted text-muted-foreground border border-transparent',
}

export function Badge({
  variant = 'default',
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  )
}
