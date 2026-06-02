import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createWorkflow,
  deleteWorkflow,
  fetchWorkflow,
  fetchWorkflows,
  updateWorkflow,
  workflowKeys,
  type CreateWorkflowInput,
  type UpdateWorkflowInput,
} from '@/lib/api/workflows'

export function useWorkflows() {
  return useQuery({
    queryKey: workflowKeys.all,
    queryFn: fetchWorkflows,
  })
}

export function useWorkflow(id: number) {
  return useQuery({
    queryKey: workflowKeys.detail(id),
    queryFn: () => fetchWorkflow(id),
    enabled: Number.isFinite(id) && id > 0,
  })
}

export function useCreateWorkflow() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateWorkflowInput) => createWorkflow(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workflowKeys.all })
    },
  })
}

export function useUpdateWorkflow() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: UpdateWorkflowInput) => updateWorkflow(input),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: workflowKeys.all })
      queryClient.invalidateQueries({
        queryKey: workflowKeys.detail(variables.id),
      })
    },
  })
}

export function useDeleteWorkflow() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteWorkflow(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: workflowKeys.all })
    },
  })
}
