import { cn } from '@/lib/cn'
import type { ReactNode } from 'react'

type TabsProps = {
  children: ReactNode
  className?: string
}

export function Tabs({ children, className }: TabsProps) {
  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {children}
    </div>
  )
}

type TabsListProps = {
  children: ReactNode
  className?: string
}

export function TabsList({ children, className }: TabsListProps) {
  return (
    <div
      className={cn(
        'inline-flex rounded-lg border border-border/50 bg-muted/40 p-1',
        className,
      )}
      role="tablist"
    >
      {children}
    </div>
  )
}

type TabsTriggerProps = {
  value: string
  activeValue: string
  onSelect: (value: string) => void
  children: ReactNode
  className?: string
}

export function TabsTrigger({
  value,
  activeValue,
  onSelect,
  children,
  className,
}: TabsTriggerProps) {
  const isActive = value === activeValue

  return (
    <button
      type="button"
      role="tab"
      aria-selected={isActive}
      onClick={() => onSelect(value)}
      className={cn(
        'flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all duration-200',
        isActive
          ? 'bg-background text-foreground shadow-sm'
          : 'text-muted-foreground hover:text-foreground',
        className,
      )}
    >
      {children}
    </button>
  )
}

type TabsContentProps = {
  value: string
  activeValue: string
  children: ReactNode
  className?: string
}

export function TabsContent({ value, activeValue, children, className }: TabsContentProps) {
  if (value !== activeValue) return null

  return (
    <div role="tabpanel" className={cn('animate-in-fade', className)}>
      {children}
    </div>
  )
}
