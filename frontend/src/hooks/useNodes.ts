import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createNode,
  deleteNode,
  fetchNodes,
  nodeKeys,
  updateNodePosition,
} from '@/lib/api/nodes'
import type { NodeCreate, NodeTypes } from '@ondeckai/shared/types/Nodes'
import { edgeKeys } from '@/lib/api/edges'

export function useWorkflowNodes(workflowId: number) {
  return useQuery({
    queryKey: nodeKeys.byWorkflow(workflowId),
    queryFn: () => fetchNodes(workflowId),
    enabled: Number.isFinite(workflowId) && workflowId > 0,
  })
}

export function useCreateNode(workflowId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: Omit<NodeCreate, 'workflow_id'>) =>
      createNode({ ...input, workflow_id: workflowId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: nodeKeys.byWorkflow(workflowId) })
    },
  })
}

export function useUpdateNodePosition(workflowId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      position_x,
      position_y,
    }: {
      id: number
      position_x: number
      position_y: number
    }) => updateNodePosition(id, position_x, position_y),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: nodeKeys.byWorkflow(workflowId) })
    },
  })
}

export function useDeleteNode(workflowId: number) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteNode(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: nodeKeys.byWorkflow(workflowId) })
      queryClient.invalidateQueries({ queryKey: edgeKeys.byWorkflow(workflowId) })
    },
  })
}

export type AddNodeInput = {
  type: NodeTypes
  position_x: number
  position_y: number
}
