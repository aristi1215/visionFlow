import type { Database } from "../database.types.js";
import type { Request } from "express";


export type NodeTypes = Database["public"]["Enums"]["node_types"]


export type NodeRow = Database["public"]["Tables"]["workflow_nodes"]["Row"]
export type NodeCreate = Omit<NodeRow, "id">;
export type NodeUpdate = Database["public"]["Tables"]["workflow_nodes"]["Update"]

export interface NodeRequest extends Request {
    body: NodeCreate
}

export interface NodeUpdateRequest extends Request {
    body: NodeUpdate
}