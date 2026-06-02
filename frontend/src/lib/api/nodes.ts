import type { NodeCreate, NodeRow } from '@ondeckai/shared/types/Nodes'
import { ApiRequestError, apiFetch, unwrapRow, unwrapRows } from './client'

export async function fetchNodes(workflowId: number): Promise<NodeRow[]> {
  try {
    const data = await apiFetch<NodeRow[] | NodeRow>(
      `/nodes/workflows/${workflowId}`,
    )
    return unwrapRows(data)
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) {
      return []
    }
    throw error
  }
}

export async function createNode(input: NodeCreate): Promise<NodeRow> {
  const data = await apiFetch<NodeRow | NodeRow[]>('/nodes', {
    method: 'POST',
    body: JSON.stringify(input),
  })
  return unwrapRow(data)
}

export async function updateNodePosition(
  id: number,
  position_x: number,
  position_y: number,
): Promise<NodeRow> {
  const data = await apiFetch<NodeRow | NodeRow[]>(`/nodes/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ position_x, position_y }),
  })
  return unwrapRow(data)
}

export async function deleteNode(id: number): Promise<void> {
  await apiFetch(`/nodes/${id}`, { method: 'DELETE' })
}

export const nodeKeys = {
  byWorkflow: (workflowId: number) => ['nodes', workflowId] as const,
}
