import type { Database } from "../database.types.js";
import type { Request } from "express";


export type WorkflowRow = Database["public"]["Tables"]["workflows"]["Row"]
export type WorkflowCreate = Omit<WorkflowRow, "id">;
export type WorkflowUpdate = Database["public"]["Tables"]["workflows"]["Update"]

export interface workflowRequest extends Request {
    body: {
        name: string;
        description: string;
        userId: string;
    }
}

export interface workflowUpdateRequest extends Request {
    body: WorkflowUpdate
}