import type { Edge, Node } from '@xyflow/react'
import type { NodeRow } from '@ondeckai/shared/types/Nodes'
import type { WorkflowEdgeRow } from '@ondeckai/shared/types/WorkFlowEdges'
import {
  createNode,
  deleteNode,
  updateNodePosition,
} from '@/lib/api/nodes'
import { createEdge, deleteEdge } from '@/lib/api/edges'
import { updateWorkflow } from '@/lib/api/workflows'
import {
  isServerEdgeId,
  isServerNodeId,
  isTempEdgeId,
  isTempNodeId,
  resolveNodeId,
  type WorkflowBaseline,
} from './workflowCanvasUtils'

export async function persistWorkflowDraft(
  workflowId: number,
  baseline: WorkflowBaseline,
  nodes: Node[],
  edges: Edge[],
  nameDraft: string,
): Promise<WorkflowBaseline> {
  const trimmedName = nameDraft.trim()
  if (!trimmedName) {
    throw new Error('Workflow name cannot be empty.')
  }

  if (trimmedName !== baseline.name) {
    await updateWorkflow({ id: workflowId, name: trimmedName })
  }

  const currentServerNodeIds = new Set(
    nodes.filter((node) => isServerNodeId(node.id)).map((node) => node.id),
  )

  const deletedNodeIds = baseline.nodes
    .map((node) => String(node.id))
    .filter((id) => !currentServerNodeIds.has(id))

  const currentServerEdgeIds = new Set(
    edges.filter((edge) => isServerEdgeId(edge.id)).map((edge) => edge.id),
  )

  const deletedEdgeIds = baseline.edges
    .map((edge) => String(edge.id))
    .filter((id) => !currentServerEdgeIds.has(id))

  for (const edgeId of deletedEdgeIds) {
    await deleteEdge(workflowId, Number(edgeId))
  }

  for (const nodeId of deletedNodeIds) {
    await deleteNode(Number(nodeId))
  }

  const idMap = new Map<string, string>()
  const createdNodes: NodeRow[] = []

  for (const node of nodes) {
    if (!isTempNodeId(node.id)) continue
    const nodeType = (node.data as { nodeType: NodeRow['type'] }).nodeType
    const created = await createNode({
      workflow_id: workflowId,
      type: nodeType,
      position_x: node.position.x,
      position_y: node.position.y,
    })
    idMap.set(node.id, String(created.id))
    createdNodes.push(created)
  }

  for (const node of nodes) {
    if (!isServerNodeId(node.id)) continue
    const baselineNode = baseline.nodes.find((item) => String(item.id) === node.id)
    if (!baselineNode) continue
    if (
      baselineNode.position_x === node.position.x &&
      baselineNode.position_y === node.position.y
    ) {
      continue
    }
    await updateNodePosition(Number(node.id), node.position.x, node.position.y)
  }

  const createdEdges: WorkflowEdgeRow[] = []

  for (const edge of edges) {
    if (!isTempEdgeId(edge.id)) continue
    const source = resolveNodeId(edge.source, idMap)
    const target = resolveNodeId(edge.target, idMap)
    const created = await createEdge(workflowId, {
      source_node: Number(source),
      target_node: Number(target),
    })
    createdEdges.push(created)
  }

  const nextBaselineNodes: NodeRow[] = [
    ...baseline.nodes
      .filter((node) => currentServerNodeIds.has(String(node.id)))
      .map((node) => {
        const current = nodes.find((item) => item.id === String(node.id))
        if (!current) return node
        return {
          ...node,
          position_x: current.position.x,
          position_y: current.position.y,
        }
      }),
    ...createdNodes,
  ]

  const nextBaselineEdges: WorkflowEdgeRow[] = [
    ...baseline.edges.filter((edge) => currentServerEdgeIds.has(String(edge.id))),
    ...createdEdges,
  ]

  return {
    name: trimmedName,
    nodes: nextBaselineNodes,
    edges: nextBaselineEdges,
  }
}
