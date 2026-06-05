import type { Database } from "../database.types.js";

export type WorkflowRow = Database["public"]["Tables"]["workflows"]["Row"]
export type WorkflowCreate = Omit<WorkflowRow, "id">;
export type WorkflowUpdate = Database["public"]["Tables"]["workflows"]["Update"]