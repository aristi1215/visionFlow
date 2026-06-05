import type { Request } from "express";
import type { NodeCreate, NodeUpdate } from "@ondeckai/shared/types/Nodes";

export interface NodeRequest extends Request {
    body: NodeCreate;
}

export interface NodeUpdateRequest extends Request {
    body: NodeUpdate;
}
