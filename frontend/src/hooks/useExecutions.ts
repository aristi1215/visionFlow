import { useQuery } from '@tanstack/react-query'
import type {
  WorkflowExecutionDetail,
  WorkflowExecutionListItem,
} from '@ondeckai/shared/types/ExecutionDetail'
import type { WorkflowExecutionRow } from '@ondeckai/shared/types/WorkflowExecution'
import {
  executionKeys,
  fetchExecution,
  fetchRecentExecutions,
  fetchWorkflowExecutions,
} from '@/lib/api/executions'

export function useRecentExecutions() {
  return useQuery<WorkflowExecutionListItem[]>({
    queryKey: executionKeys.recent,
    queryFn: fetchRecentExecutions,
  })
}

export function useWorkflowExecutions(workflowId: number) {
  return useQuery<WorkflowExecutionRow[]>({
    queryKey: executionKeys.byWorkflow(workflowId),
    queryFn: () => fetchWorkflowExecutions(workflowId),
    enabled: Number.isFinite(workflowId) && workflowId > 0,
  })
}

export function useExecution(executionId: number) {
  return useQuery<WorkflowExecutionDetail>({
    queryKey: executionKeys.detail(executionId),
    queryFn: () => fetchExecution(executionId),
    enabled: Number.isFinite(executionId) && executionId > 0,
  })
}
