import type { Database } from "../database.types.js";
import type { Request } from "express";


export type WorkflowEdgeRow = Database["public"]["Tables"]["workflow_edges"]["Row"]
export type WorkflowEdgeCreate = Omit<WorkflowEdgeRow, "id">;
export type WorkflowEdgeUpdate = Database["public"]["Tables"]["workflow_edges"]["Update"]

export interface workflowEdgeRequest extends Request {
    body: WorkflowEdgeCreate
}

export interface workflowEdgeUpdateRequest extends Request {
    body: WorkflowEdgeUpdate
}