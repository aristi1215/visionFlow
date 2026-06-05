import type { ExecutionNodeRow } from "./ExecutionNodes.js";
import type { NodeTypes } from "./Nodes.js";
import type { WorkflowExecutionRow } from "./WorkflowExecution.js";

export type ExecutionNodeDetail = ExecutionNodeRow & {
    node_type: NodeTypes | null;
};

export type WorkflowExecutionDetail = WorkflowExecutionRow & {
    execution_nodes: ExecutionNodeDetail[];
};

export type WorkflowExecutionListItem = WorkflowExecutionRow & {
    workflow_name: string | null;
};
