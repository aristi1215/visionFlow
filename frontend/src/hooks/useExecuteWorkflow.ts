import { useMutation, useQueryClient } from '@tanstack/react-query'
import { executeWorkflow, type ExecuteWorkflowInput } from '@/lib/api/engine'
import { executionKeys } from '@/lib/api/executions'

export function useExecuteWorkflow(workflowId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: ExecuteWorkflowInput) => executeWorkflow(workflowId, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: executionKeys.recent })
      queryClient.invalidateQueries({
        queryKey: executionKeys.byWorkflow(workflowId),
      })
    },
  })
}
