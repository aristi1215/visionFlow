import { useRef } from 'react'
import { NODE_REGISTRY, CATEGORY_LABELS, type NodeCategory } from '@/features/workflows/nodeRegistry'
import { NodeIcon } from '@/features/workflows/nodeIcons'
import type { NodeTypes } from '@ondeckai/shared/types/Nodes'
import { cn } from '@/lib/cn'

export const NODE_DRAG_TYPE = 'application/ondeck-node-type'

type NodePaletteProps = {
  onAddNode: (type: NodeTypes) => void
  className?: string
}

const categories: NodeCategory[] = ['ingest', 'analysis', 'alert', 'output']

export function NodePalette({ onAddNode, className }: NodePaletteProps) {
  const didDragRef = useRef(false)

  return (
    <aside
      className={cn(
        'flex w-60 shrink-0 flex-col overflow-hidden border-r border-border/50 bg-background/95 backdrop-blur-xl',
        className,
      )}
    >
      <div className="shrink-0 border-b border-border/50 px-4 py-3">
        <h3 className="text-sm font-medium text-foreground">Node library</h3>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Drag or click to add to canvas
        </p>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-3">
        {categories.map((category) => {
          const nodes = NODE_REGISTRY.filter((node) => node.category === category)
          if (nodes.length === 0) return null

          return (
            <div key={category} className="mb-4 last:mb-0">
              <p className="mb-2 px-1 text-xs font-medium text-muted-foreground">
                {CATEGORY_LABELS[category]}
              </p>
              <div className="space-y-1">
                {nodes.map((node) => (
                  <button
                    key={node.type}
                    type="button"
                    draggable
                    onDragStart={(event) => {
                      didDragRef.current = true
                      event.dataTransfer.setData(NODE_DRAG_TYPE, node.type)
                      event.dataTransfer.effectAllowed = 'move'
                    }}
                    onDragEnd={() => {
                      window.setTimeout(() => {
                        didDragRef.current = false
                      }, 0)
                    }}
                    onClick={() => {
                      if (didDragRef.current) return
                      onAddNode(node.type)
                    }}
                    className={cn(
                      'flex w-full cursor-grab items-start gap-2 rounded-lg border border-transparent px-2 py-2 text-left',
                      'transition-all duration-200 hover:border-border/50 hover:bg-muted/50 active:cursor-grabbing',
                    )}
                  >
                    <div className="rounded-md bg-muted/60 p-1.5">
                      <NodeIcon type={node.type} className="h-3.5 w-3.5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium text-foreground">
                        {node.label}
                      </p>
                      <p className="line-clamp-2 text-[10px] text-muted-foreground">
                        {node.description}
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </aside>
  )
}
