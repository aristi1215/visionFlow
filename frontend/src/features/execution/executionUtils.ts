import type { Node } from '@xyflow/react'
import type { WorkflowExecutionSummary } from '@ondeckai/shared/types/WorkflowExecutionSummary'
import type { WorkflowExecutionDetail } from '@ondeckai/shared/types/ExecutionDetail'
import type {
  NodeExecutionStatus,
  WorkflowNodeData,
} from '@/features/editor/WorkflowNode'

export function applyExecutionSummaryToNodes(
  nodes: Node[],
  summary: WorkflowExecutionSummary,
): Node[] {
  const completedIds = new Set(summary.nodeResults.map((r) => r.nodeId))
  const skippedIds = new Set(summary.skippedDanglingNodes)

  return nodes.map((node) => {
    const nodeData = node.data as WorkflowNodeData
    const nodeId = Number(node.id)
    let executionStatus: NodeExecutionStatus = 'idle'

    if (nodeData.nodeType === 'upload_video') {
      executionStatus = 'skipped'
    } else if (skippedIds.has(nodeId)) {
      executionStatus = 'skipped'
    } else if (completedIds.has(nodeId)) {
      executionStatus = 'completed'
    } else if (summary.executionOrder.includes(nodeId)) {
      executionStatus = summary.status === 'failed' ? 'failed' : 'idle'
    }

    return {
      ...node,
      data: { ...nodeData, executionStatus },
    }
  })
}

export function setNodeExecutionStatus(
  nodes: Node[],
  nodeId: number,
  status: NodeExecutionStatus,
): Node[] {
  return nodes.map((node) => {
    if (Number(node.id) !== nodeId) return node
    const nodeData = node.data as WorkflowNodeData
    return { ...node, data: { ...nodeData, executionStatus: status } }
  })
}

export function resetNodeExecutionStatus(nodes: Node[]): Node[] {
  return nodes.map((node) => {
    const nodeData = node.data as WorkflowNodeData
    return { ...node, data: { ...nodeData, executionStatus: 'idle' } }
  })
}

function extractReportFromNodeOutput(output: unknown): string | null {
  if (!output || typeof output !== 'object') return null
  const record = output as Record<string, unknown>
  return typeof record.output_report === 'string' ? record.output_report : null
}

export function extractOutputReport(
  summary: Pick<WorkflowExecutionSummary, 'outputReport' | 'nodeResults'>,
): string | null {
  if (summary.outputReport) return summary.outputReport

  const saveResults = summary.nodeResults.find((r) => r.type === 'save_results_node')
  if (!saveResults) return null

  return extractReportFromNodeOutput(saveResults.output)
}

export function executionDetailToSummary(
  detail: WorkflowExecutionDetail,
): WorkflowExecutionSummary {
  const nodeResults = detail.execution_nodes
    .filter((n) => n.node_type && n.node_type !== 'upload_video')
    .map((n) => ({
      nodeId: n.node_id,
      type: n.node_type!,
      executionNodeId: n.id,
      output: n.output_json,
    }))

  const saveResults = nodeResults.find((r) => r.type === 'save_results_node')
  const outputReport =
    detail.output_report ?? extractReportFromNodeOutput(saveResults?.output) ?? null

  return {
    executionId: detail.id,
    workflowId: detail.workflow_id,
    videoId: detail.video_id,
    status: detail.status === 'failed' ? 'failed' : 'completed',
    executionOrder: nodeResults.map((r) => r.nodeId),
    skippedDanglingNodes: [],
    nodeResults,
    outputReport,
  }
}

export async function animateExecutionProgress(
  nodes: Node[],
  executionOrder: number[],
  setNodes: (updater: (current: Node[]) => Node[]) => void,
  skippedDanglingNodes: number[],
) {
  const skipped = new Set(skippedDanglingNodes)

  for (const nodeId of executionOrder) {
    const node = nodes.find((n) => Number(n.id) === nodeId)
    const nodeData = node?.data as WorkflowNodeData | undefined
    if (nodeData?.nodeType === 'upload_video' || skipped.has(nodeId)) {
      setNodes((current) => setNodeExecutionStatus(current, nodeId, 'skipped'))
      continue
    }

    setNodes((current) => setNodeExecutionStatus(current, nodeId, 'running'))
    await new Promise((resolve) => setTimeout(resolve, 400))
    setNodes((current) => setNodeExecutionStatus(current, nodeId, 'completed'))
  }
}
