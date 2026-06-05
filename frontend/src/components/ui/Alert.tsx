import { AlertCircle, CheckCircle2, Info } from 'lucide-react'
import { cn } from '@/lib/cn'

type AlertVariant = 'error' | 'success' | 'info' | 'warning'

type AlertProps = {
  variant?: AlertVariant
  title?: string
  children: React.ReactNode
  className?: string
}

const variantStyles: Record<AlertVariant, string> = {
  error: 'border-destructive/30 bg-destructive/5 text-destructive',
  success: 'border-primary/30 bg-primary/5 text-primary',
  info: 'border-border/60 bg-muted/40 text-foreground',
  warning: 'border-zinc-400/30 bg-muted/60 text-foreground',
}

const icons: Record<AlertVariant, typeof AlertCircle> = {
  error: AlertCircle,
  success: CheckCircle2,
  info: Info,
  warning: AlertCircle,
}

export function Alert({
  variant = 'info',
  title,
  children,
  className,
}: AlertProps) {
  const Icon = icons[variant]

  return (
    <div
      role="alert"
      className={cn(
        'flex gap-3 rounded-xl border p-4 text-sm',
        variantStyles[variant],
        className,
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <div className="min-w-0">
        {title && <p className="font-medium">{title}</p>}
        <div className={cn(title && 'mt-1', 'text-sm leading-relaxed opacity-90')}>
          {children}
        </div>
      </div>
    </div>
  )
}
