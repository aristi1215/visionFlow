import { NodeTypes } from "@ondeckai/shared/types/Nodes"

type WorkflowRunContext = {
    executionId: number
    videoId: number
    videoUrl: string
    workflowId: number
    // Last node's output
    previousOutput?: unknown
    // Node configuration (when saved to DB)
    nodeConfig?: Record<string, unknown>
}


export type { WorkflowRunContext };