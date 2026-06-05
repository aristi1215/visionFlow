import type { Database } from "../database.types.js";

export type NodeTypes = Database["public"]["Enums"]["node_types"]

export type NodeRow = Database["public"]["Tables"]["workflow_nodes"]["Row"]
export type NodeCreate = Database["public"]["Tables"]["workflow_nodes"]["Insert"]
export type NodeUpdate = Database["public"]["Tables"]["workflow_nodes"]["Update"]