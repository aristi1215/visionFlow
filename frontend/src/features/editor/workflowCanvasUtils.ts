import type { Edge, Node } from '@xyflow/react'
import type { WorkflowEdgeRow } from '@ondeckai/shared/types/WorkFlowEdges'
import type { NodeRow, NodeTypes } from '@ondeckai/shared/types/Nodes'
import { NODE_BY_TYPE } from '@/features/workflows/nodeRegistry'
import { configsEqual } from '@/features/workflows/configKeys'
import type { WorkflowNodeData } from './WorkflowNode'

export const TEMP_NODE_PREFIX = 'temp:'
export const TEMP_EDGE_PREFIX = 'temp-edge:'

export function createTempNodeId() {
  return `${TEMP_NODE_PREFIX}${crypto.randomUUID()}`
}

export function createTempEdgeId() {
  return `${TEMP_EDGE_PREFIX}${crypto.randomUUID()}`
}

export function isTempNodeId(id: string) {
  return id.startsWith(TEMP_NODE_PREFIX)
}

export function isTempEdgeId(id: string) {
  return id.startsWith(TEMP_EDGE_PREFIX)
}

export function isServerNodeId(id: string) {
  return !isTempNodeId(id) && Number.isFinite(Number(id))
}

export function isServerEdgeId(id: string) {
  return !isTempEdgeId(id) && Number.isFinite(Number(id))
}

export type WorkflowBaseline = {
  name: string
  nodes: NodeRow[]
  edges: WorkflowEdgeRow[]
}

function normalizeConfig(config: NodeRow['config']): Record<string, unknown> {
  if (config && typeof config === 'object' && !Array.isArray(config)) {
    return config as Record<string, unknown>
  }
  return {}
}

export function toFlowNodes(apiNodes: NodeRow[]): Node[] {
  return apiNodes.map((node) => ({
    id: String(node.id),
    type: 'workflowNode',
    position: { x: node.position_x, y: node.position_y },
    data: {
      label: NODE_BY_TYPE[node.type].label,
      nodeType: node.type,
      config: normalizeConfig(node.config),
      executionStatus: 'idle',
    } satisfies WorkflowNodeData,
  }))
}

export function toFlowEdges(apiEdges: WorkflowEdgeRow[]): Edge[] {
  return apiEdges
    .filter((edge) => edge.target_node != null)
    .map((edge) => ({
      id: String(edge.id),
      source: String(edge.source_node),
      target: String(edge.target_node),
      animated: true,
    }))
}

export function createFlowNode(
  type: NodeTypes,
  position: { x: number; y: number },
): Node {
  return {
    id: createTempNodeId(),
    type: 'workflowNode',
    position,
    data: {
      label: NODE_BY_TYPE[type].label,
      nodeType: type,
      config: {},
      executionStatus: 'idle',
    } satisfies WorkflowNodeData,
  }
}

export function resolveNodeId(id: string, idMap: Map<string, string>) {
  return idMap.get(id) ?? id
}

export function isWorkflowDirty(
  baseline: WorkflowBaseline,
  nodes: Node[],
  edges: Edge[],
  nameDraft: string,
) {
  if (nameDraft.trim() !== baseline.name) return true

  const baselineNodeIds = new Set(baseline.nodes.map((node) => String(node.id)))
  const currentServerNodeIds = new Set(
    nodes.filter((node) => isServerNodeId(node.id)).map((node) => node.id),
  )

  if (nodes.some((node) => isTempNodeId(node.id))) return true
  if (baselineNodeIds.size !== currentServerNodeIds.size) return true
  for (const id of baselineNodeIds) {
    if (!currentServerNodeIds.has(id)) return true
  }

  for (const node of nodes) {
    if (!isServerNodeId(node.id)) continue
    const baselineNode = baseline.nodes.find((item) => String(item.id) === node.id)
    if (!baselineNode) continue
    if (
      baselineNode.position_x !== node.position.x ||
      baselineNode.position_y !== node.position.y
    ) {
      return true
    }

    const nodeData = node.data as WorkflowNodeData
    const baselineConfig = normalizeConfig(baselineNode.config)
    if (!configsEqual(baselineConfig, nodeData.config ?? {})) {
      return true
    }
  }

  const baselineEdgeIds = new Set(baseline.edges.map((edge) => String(edge.id)))
  const currentServerEdgeIds = new Set(
    edges.filter((edge) => isServerEdgeId(edge.id)).map((edge) => edge.id),
  )

  if (edges.some((edge) => isTempEdgeId(edge.id))) return true
  if (baselineEdgeIds.size !== currentServerEdgeIds.size) return true
  for (const id of baselineEdgeIds) {
    if (!currentServerEdgeIds.has(id)) return true
  }

  for (const edge of edges) {
    if (!isServerEdgeId(edge.id)) continue
    const baselineEdge = baseline.edges.find((item) => String(item.id) === edge.id)
    if (!baselineEdge) continue
    if (
      String(baselineEdge.source_node) !== edge.source ||
      String(baselineEdge.target_node) !== edge.target
    ) {
      return true
    }
  }

  return false
}
