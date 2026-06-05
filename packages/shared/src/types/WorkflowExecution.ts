import type { Database } from "../database.types.js";

export type WorkflowExecutionRow = Database["public"]["Tables"]["workflow_execution"]["Row"];
export type WorkflowExecutionInsert = Database["public"]["Tables"]["workflow_execution"]["Insert"];
export type WorkflowExecutionUpdate = Database["public"]["Tables"]["workflow_execution"]["Update"];
export type WorkflowExecutionCreate = Omit<WorkflowExecutionRow, "id">;
export type WorkflowExecutionStatus = Database["public"]["Enums"]["execution_alert_status"];
