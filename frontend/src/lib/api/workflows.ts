import type { WorkflowRow } from '@ondeckai/shared/types/Workflows'
import { apiFetch, unwrapRow } from './client'

export type CreateWorkflowInput = {
  name: string
  description: string
}

export type UpdateWorkflowInput = {
  id: number
  name?: string
  description?: string
}

export async function fetchWorkflows(): Promise<WorkflowRow[]> {
  const data = await apiFetch<{ length: number; workflows: WorkflowRow[] }>(
    '/workflows',
  )
  return data.workflows ?? []
}

export async function fetchWorkflow(id: number): Promise<WorkflowRow> {
  const data = await apiFetch<{ workflow: WorkflowRow | WorkflowRow[] }>(
    `/workflows/${id}`,
  )
  return unwrapRow(data.workflow)
}

export async function createWorkflow(
  input: CreateWorkflowInput,
): Promise<WorkflowRow> {
  const data = await apiFetch<{ workflow: WorkflowRow | WorkflowRow[] }>(
    '/workflows',
    {
      method: 'POST',
      body: JSON.stringify(input),
    },
  )
  return unwrapRow(data.workflow)
}

export async function updateWorkflow(
  input: UpdateWorkflowInput,
): Promise<WorkflowRow> {
  const { id, ...body } = input
  const data = await apiFetch<{ workflow: WorkflowRow | WorkflowRow[] }>(
    `/workflows/${id}`,
    {
      method: 'PATCH',
      body: JSON.stringify(body),
    },
  )
  return unwrapRow(data.workflow)
}

export async function deleteWorkflow(id: number): Promise<void> {
  await apiFetch(`/workflows/${id}`, { method: 'DELETE' })
}

export const workflowKeys = {
  all: ['workflows'] as const,
  detail: (id: number) => ['workflows', id] as const,
}
