import type { ExecutionNodeRow } from "@ondeckai/shared/types/ExecutionNodes";
import type { WorkflowExecutionRow } from "@ondeckai/shared/types/WorkflowExecution";
import type { NodeTypes } from "@ondeckai/shared/types/Nodes";
import { DatabaseError, NotFoundError } from "../errors/errors.js";
import { supabase } from "../integrations/supabase.js";

export type ExecutionNodeDetail = ExecutionNodeRow & {
    node_type: NodeTypes | null;
};

export type WorkflowExecutionDetail = WorkflowExecutionRow & {
    execution_nodes: ExecutionNodeDetail[];
};

export type WorkflowExecutionListItem = WorkflowExecutionRow & {
    workflow_name: string | null;
};

class ExecutionsService {
    static async getExecutionsByWorkflowId(workflowId: number): Promise<WorkflowExecutionRow[]> {
        const { data, error } = await supabase
            .from("workflow_execution")
            .select("*")
            .eq("workflow_id", workflowId)
            .order("started_at", { ascending: false });

        if (error) throw new DatabaseError(error.message);
        return data ?? [];
    }

    static async getRecentExecutionsForUser(userId: string, limit = 20): Promise<WorkflowExecutionListItem[]> {
        const { data: workflows, error: workflowsError } = await supabase
            .from("workflows")
            .select("id, name")
            .eq("user_id", userId);

        if (workflowsError) throw new DatabaseError(workflowsError.message);
        if (!workflows?.length) return [];

        const workflowIds = workflows.map((w) => w.id);
        const workflowNames = new Map(workflows.map((w) => [w.id, w.name]));

        const { data, error } = await supabase
            .from("workflow_execution")
            .select("*")
            .in("workflow_id", workflowIds)
            .order("started_at", { ascending: false })
            .limit(limit);

        if (error) throw new DatabaseError(error.message);

        return (data ?? []).map((execution) => ({
            ...execution,
            workflow_name: workflowNames.get(execution.workflow_id) ?? null,
        }));
    }

    static async getExecutionById(executionId: number): Promise<WorkflowExecutionDetail> {
        const { data: execution, error: executionError } = await supabase
            .from("workflow_execution")
            .select("*")
            .eq("id", executionId)
            .single();

        if (executionError) throw new DatabaseError(executionError.message);
        if (!execution) throw new NotFoundError("Execution not found");

        const { data: executionNodes, error: nodesError } = await supabase
            .from("execution_nodes")
            .select("*")
            .eq("execution_id", executionId)
            .order("id", { ascending: true });

        if (nodesError) throw new DatabaseError(nodesError.message);

        const nodeIds = (executionNodes ?? []).map((n) => n.node_id);
        let nodeTypeMap = new Map<number, NodeTypes>();

        if (nodeIds.length > 0) {
            const { data: workflowNodes, error: workflowNodesError } = await supabase
                .from("workflow_nodes")
                .select("id, type")
                .in("id", nodeIds);

            if (workflowNodesError) throw new DatabaseError(workflowNodesError.message);
            nodeTypeMap = new Map(
                (workflowNodes ?? []).map((n) => [n.id, n.type as NodeTypes]),
            );
        }

        const execution_nodes: ExecutionNodeDetail[] = (executionNodes ?? []).map((node) => ({
            ...node,
            node_type: nodeTypeMap.get(node.node_id) ?? null,
        }));

        return { ...execution, execution_nodes };
    }
}

export default ExecutionsService;
