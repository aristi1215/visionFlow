import { cn } from '@/lib/cn'
import type { ReactNode } from 'react'

type DataTableProps = {
  children?: ReactNode
  className?: string
}

export function DataTable({ children, className }: DataTableProps) {
  return (
    <div className={cn('overflow-x-auto rounded-xl border border-border/50', className)}>
      <table className="w-full text-sm">{children}</table>
    </div>
  )
}

export function DataTableHeader({ children, className }: DataTableProps) {
  return (
    <thead className={cn('border-b border-border/50 bg-muted/30', className)}>
      {children}
    </thead>
  )
}

export function DataTableBody({ children, className }: DataTableProps) {
  return <tbody className={cn('divide-y divide-border/50', className)}>{children}</tbody>
}

export function DataTableRow({ children, className }: DataTableProps) {
  return (
    <tr className={cn('transition-colors hover:bg-muted/30', className)}>
      {children}
    </tr>
  )
}

export function DataTableHead({ children, className }: DataTableProps) {
  return (
    <th
      className={cn(
        'px-4 py-3 text-left text-xs font-medium text-muted-foreground',
        className,
      )}
    >
      {children}
    </th>
  )
}

export function DataTableCell({ children, className }: DataTableProps) {
  return (
    <td className={cn('px-4 py-3 text-foreground', className)}>
      {children}
    </td>
  )
}
