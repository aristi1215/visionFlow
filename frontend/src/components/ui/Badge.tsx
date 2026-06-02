import { cn } from '@/lib/cn'
import type { HTMLAttributes } from 'react'

type BadgeVariant = 'default' | 'secondary' | 'outline' | 'orange' | 'brown'

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: BadgeVariant
}

const variantStyles: Record<BadgeVariant, string> = {
  default: 'bg-primary/10 text-primary border border-primary/20',
  secondary: 'bg-secondary text-secondary-foreground border border-border',
  outline: 'bg-transparent text-foreground border border-border',
  orange: 'bg-orange-100 text-orange-800 border border-orange-200 dark:bg-orange-950 dark:text-orange-200 dark:border-orange-800',
  brown: 'bg-brown-100 text-brown-800 border border-brown-200 dark:bg-brown-900 dark:text-brown-200 dark:border-brown-700',
}

export function Badge({
  variant = 'default',
  className,
  ...props
}: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium tracking-wide',
        variantStyles[variant],
        className,
      )}
      {...props}
    />
  )
}
