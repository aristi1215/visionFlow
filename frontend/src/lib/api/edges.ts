import type {
  WorkflowEdgeCreateBody,
  WorkflowEdgeRow,
} from '@ondeckai/shared/types/WorkFlowEdges'
import { ApiRequestError, apiFetch, unwrapRow, unwrapRows } from './client'

export async function fetchEdges(workflowId: number): Promise<WorkflowEdgeRow[]> {
  try {
    const data = await apiFetch<WorkflowEdgeRow[] | WorkflowEdgeRow>(
      `/workflows/${workflowId}/edges`,
    )
    return unwrapRows(data)
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 404) {
      return []
    }
    throw error
  }
}

export async function createEdge(
  workflowId: number,
  body: WorkflowEdgeCreateBody,
): Promise<WorkflowEdgeRow> {
  const data = await apiFetch<WorkflowEdgeRow | WorkflowEdgeRow[]>(
    `/workflows/${workflowId}/edges`,
    {
      method: 'POST',
      body: JSON.stringify(body),
    },
  )
  return unwrapRow(data)
}

export async function deleteEdge(
  workflowId: number,
  edgeId: number,
): Promise<void> {
  await apiFetch(`/workflows/${workflowId}/edges/${edgeId}`, {
    method: 'DELETE',
  })
}

export const edgeKeys = {
  byWorkflow: (workflowId: number) => ['edges', workflowId] as const,
}
