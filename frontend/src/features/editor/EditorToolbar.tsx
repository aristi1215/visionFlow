import { Badge, Button } from '@/components/ui'
import { cn } from '@/lib/cn'
import { Grid3x3, LayoutGrid, Maximize2 } from 'lucide-react'

type EditorToolbarProps = {
  snapToGrid: boolean
  onToggleSnap: () => void
  onFitView: () => void
  onAutoLayout: () => void
  isDirty?: boolean
  nodeCount?: number
  edgeCount?: number
  className?: string
}

export function EditorToolbar({
  snapToGrid,
  onToggleSnap,
  onFitView,
  onAutoLayout,
  isDirty,
  nodeCount,
  edgeCount,
  className,
}: EditorToolbarProps) {
  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-between gap-2 border-t border-border/50 bg-background/80 px-4 py-2 backdrop-blur-xl',
        className,
      )}
    >
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" onClick={onFitView}>
          <Maximize2 className="h-4 w-4" />
          Fit view
        </Button>
        <Button variant="ghost" size="sm" onClick={onAutoLayout}>
          <LayoutGrid className="h-4 w-4" />
          Auto layout
        </Button>
        <Button
          variant={snapToGrid ? 'secondary' : 'ghost'}
          size="sm"
          onClick={onToggleSnap}
        >
          <Grid3x3 className="h-4 w-4" />
          Snap grid
        </Button>
      </div>
      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        {nodeCount != null && edgeCount != null && (
          <span>
            {nodeCount} node{nodeCount === 1 ? '' : 's'} · {edgeCount} connection
            {edgeCount === 1 ? '' : 's'}
          </span>
        )}
        {isDirty && (
          <Badge variant="default" className="text-[10px]">
            Unsaved
          </Badge>
        )}
      </div>
    </div>
  )
}
