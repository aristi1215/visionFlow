import type { WorkflowExecutionSummary } from '@ondeckai/shared/types/WorkflowExecutionSummary'
import { apiFetch } from './client'

export type ExecuteWorkflowInput = {
  videoId: number
}

export async function executeWorkflow(
  workflowId: number,
  input: ExecuteWorkflowInput,
): Promise<WorkflowExecutionSummary> {
  return apiFetch<WorkflowExecutionSummary>(`/engine/${workflowId}/execute`, {
    method: 'POST',
    body: JSON.stringify(input),
  })
}
