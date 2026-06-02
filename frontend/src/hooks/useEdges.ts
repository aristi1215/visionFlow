import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createEdge,
  deleteEdge,
  edgeKeys,
  fetchEdges,
} from '@/lib/api/edges'

export function useWorkflowEdges(workflowId: number) {
  return useQuery({
    queryKey: edgeKeys.byWorkflow(workflowId),
    queryFn: () => fetchEdges(workflowId),
    enabled: Number.isFinite(workflowId) && workflowId > 0,
  })
}

export function useCreateEdge(workflowId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (body: { source_node: number; target_node: number }) =>
      createEdge(workflowId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: edgeKeys.byWorkflow(workflowId) })
    },
  })
}

export function useDeleteEdge(workflowId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (edgeId: number) => deleteEdge(workflowId, edgeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: edgeKeys.byWorkflow(workflowId) })
    },
  })
}
