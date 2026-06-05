import type { Request } from "express";
import type {
    WorkflowEdgeCreateBody,
    WorkflowEdgeUpdate,
} from "@ondeckai/shared/types/WorkFlowEdges";

export interface WorkflowEdgeRequest extends Request {
    body: WorkflowEdgeCreateBody;
    params: { workflowId: string };
}

export interface WorkflowEdgeUpdateRequest extends Request {
    body: WorkflowEdgeUpdate;
}
