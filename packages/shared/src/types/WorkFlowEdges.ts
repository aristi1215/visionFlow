import type { Database } from "../database.types.js";

export type WorkflowEdgeRow = Database["public"]["Tables"]["workflow_edges"]["Row"]
export type WorkflowEdgeCreate = Omit<WorkflowEdgeRow, "id">;
export type WorkflowEdgeCreateBody = Omit<WorkflowEdgeCreate, "workflow_id">;
export type WorkflowEdgeUpdate = Database["public"]["Tables"]["workflow_edges"]["Update"]