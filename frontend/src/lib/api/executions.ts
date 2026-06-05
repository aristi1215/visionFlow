import type {
  WorkflowExecutionDetail,
  WorkflowExecutionListItem,
} from '@ondeckai/shared/types/ExecutionDetail'
import type { WorkflowExecutionRow } from '@ondeckai/shared/types/WorkflowExecution'
import { apiFetch } from './client'

type ExecutionsListResponse = {
  length: number
  executions: WorkflowExecutionRow[] | WorkflowExecutionListItem[]
}

export async function fetchWorkflowExecutions(
  workflowId: number,
): Promise<WorkflowExecutionRow[]> {
  const data = await apiFetch<ExecutionsListResponse>(
    `/workflows/${workflowId}/executions`,
  )
  return data.executions as WorkflowExecutionRow[]
}

export async function fetchRecentExecutions(): Promise<WorkflowExecutionListItem[]> {
  const data = await apiFetch<ExecutionsListResponse>('/executions')
  return data.executions as WorkflowExecutionListItem[]
}

export async function fetchExecution(
  executionId: number,
): Promise<WorkflowExecutionDetail> {
  return apiFetch<WorkflowExecutionDetail>(`/executions/${executionId}`)
}

export const executionKeys = {
  all: ['executions'] as const,
  recent: ['executions', 'recent'] as const,
  byWorkflow: (workflowId: number) => ['executions', 'workflow', workflowId] as const,
  detail: (executionId: number) => ['executions', executionId] as const,
}
