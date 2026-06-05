import type { NodeTypes } from "./Nodes.js";

export type WorkflowExecutionNodeResult = {
    nodeId: number;
    type: NodeTypes;
    executionNodeId: number;
    output: unknown;
};

export type WorkflowExecutionSummary = {
    executionId: number;
    workflowId: number;
    videoId: number;
    status: "completed" | "failed";
    executionOrder: number[];
    skippedDanglingNodes: number[];
    nodeResults: WorkflowExecutionNodeResult[];
};
