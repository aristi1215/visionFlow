import type { Database } from "../database.types.js";

export type ExecutionNodeRow = Database["public"]["Tables"]["execution_nodes"]["Row"];
export type ExecutionNodeInsert = Database["public"]["Tables"]["execution_nodes"]["Insert"];
export type ExecutionNodeUpdate = Database["public"]["Tables"]["execution_nodes"]["Update"];
export type ExecutionNodeCreate = Omit<ExecutionNodeRow, "id">;
export type ExecutionStatus = Database["public"]["Enums"]["execution_alert_status"];
