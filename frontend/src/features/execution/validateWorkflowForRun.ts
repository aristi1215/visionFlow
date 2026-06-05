import type { Edge, Node } from '@xyflow/react'
import type { NodeTypes } from '@ondeckai/shared/types/Nodes'
import type { WorkflowNodeData } from '@/features/editor/WorkflowNode'
import {
  isServerEdgeId,
  isServerNodeId,
  isTempEdgeId,
  isTempNodeId,
  type WorkflowBaseline,
} from '@/features/editor/workflowCanvasUtils'

const UNSUPPORTED_NODE_TYPES: NodeTypes[] = [
  'extract_frames',
  'scene_analysis',
]

export type WorkflowRunValidation = {
  canRun: boolean
  errors: string[]
  warnings: string[]
}

export function validateWorkflowForRun(
  baseline: WorkflowBaseline | null,
  nodes: Node[],
  edges: Edge[],
  isDirty: boolean,
  videoId: number | null,
): WorkflowRunValidation {
  const errors: string[] = []
  const warnings: string[] = []

  if (!baseline) {
    errors.push('Workflow is not loaded yet.')
    return { canRun: false, errors, warnings }
  }

  if (isDirty) {
    errors.push('Save your workflow before running.')
  }

  if (nodes.some((node) => isTempNodeId(node.id))) {
    errors.push('New nodes must be saved before running.')
  }

  if (edges.some((edge) => isTempEdgeId(edge.id))) {
    errors.push('New connections must be saved before running.')
  }

  if (!videoId) {
    errors.push('Select or upload a video to run this workflow.')
  }

  const unsupported = nodes.filter((node) => {
    const type = (node.data as WorkflowNodeData).nodeType
    return UNSUPPORTED_NODE_TYPES.includes(type)
  })

  if (unsupported.length > 0) {
    errors.push(
      'This workflow contains nodes that are not supported yet (Extract frames, Scene analysis). Remove them to run.',
    )
  }

  const serverNodeIds = new Set(
    nodes.filter((n) => isServerNodeId(n.id)).map((n) => Number(n.id)),
  )

  const connectedIds = new Set<number>()
  for (const edge of edges) {
    if (!isServerEdgeId(edge.id)) continue
    connectedIds.add(Number(edge.source))
    connectedIds.add(Number(edge.target))
  }

  const dangling = [...serverNodeIds].filter((id) => !connectedIds.has(id))
  if (dangling.length > 0) {
    warnings.push(
      `${dangling.length} disconnected node(s) will be skipped during execution.`,
    )
  }

  const executableTypes = new Set<NodeTypes>([
    'object_detection',
    'timeline_events_generator',
    'ai_description_node',
    'alert_node',
    'save_results_node',
  ])

  const hasExecutable = nodes.some((node) => {
    if (!isServerNodeId(node.id)) return false
    if (!connectedIds.has(Number(node.id))) return false
    const type = (node.data as WorkflowNodeData).nodeType
    return executableTypes.has(type)
  })

  if (!hasExecutable) {
    errors.push(
      'Add at least one connected analysis, alert, or output node to run.',
    )
  }

  if (nodes.length === 0) {
    errors.push('Add at least one node to the workflow.')
  }

  return {
    canRun: errors.length === 0,
    errors,
    warnings,
  }
}
