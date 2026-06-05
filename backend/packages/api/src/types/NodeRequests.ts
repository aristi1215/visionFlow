import type { Request } from "express";
import type { NodeCreate, NodeUpdate } from "@ondeckai/shared/types/Nodes";

export interface NodeRequest extends Request {
    body: NodeCreate;
    params: { id?: string };
}

export interface NodeUpdateRequest extends Request {
    body: NodeUpdate;
    params: { id: string };
}
