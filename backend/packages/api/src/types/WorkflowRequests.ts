import type { Request } from "express";
import type { WorkflowUpdate } from "@ondeckai/shared/types/Workflows";

export interface WorkflowRequest extends Request {
    body: {
        name: string;
        description: string;
        userId: string;
    };
}

export interface WorkflowUpdateRequest extends Request {
    body: WorkflowUpdate;
    params: { workflowId: string };
}
