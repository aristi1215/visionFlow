import { memo } from 'react'
import { Handle, Position, type NodeProps } from '@xyflow/react'
import { Badge } from '@/components/ui'
import { NODE_BY_TYPE } from '@/features/workflows/nodeRegistry'
import { NodeIcon } from '@/features/workflows/nodeIcons'
import type { NodeTypes } from '@ondeckai/shared/types/Nodes'
import { cn } from '@/lib/cn'

export type WorkflowNodeData = {
  label: string
  nodeType: NodeTypes
}

function WorkflowNodeComponent({ data, selected }: NodeProps) {
  const nodeData = data as WorkflowNodeData
  const definition = NODE_BY_TYPE[nodeData.nodeType]

  return (
    <div
      className={cn(
        'min-w-[180px] rounded-lg border-2 bg-card px-3 py-2.5 shadow-sm transition-shadow',
        definition.accentClass,
        selected && 'shadow-md ring-2 ring-ring ring-offset-2 ring-offset-background',
      )}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!h-2.5 !w-2.5 !border-2 !border-background !bg-muted-foreground"
      />
      <div className="flex items-start gap-2">
        <div className="rounded-md bg-muted p-1.5">
          <NodeIcon type={nodeData.nodeType} className="h-4 w-4 text-foreground" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-foreground">
            {nodeData.label}
          </p>
          <Badge variant="brown" className="mt-1 text-[10px]">
            {definition.category}
          </Badge>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!h-2.5 !w-2.5 !border-2 !border-background !bg-primary"
      />
    </div>
  )
}

export const WorkflowNode = memo(WorkflowNodeComponent)

export const workflowNodeTypes = {
  workflowNode: WorkflowNode,
}
