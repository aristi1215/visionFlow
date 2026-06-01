import { supabase } from "../integrations/supabase.js";
import { DatabaseError, NotFoundError, ValidationError } from "../errors/errors.js";
import type { WorkflowEdgeCreateBody, WorkflowEdgeUpdate } from "@ondeckai/shared/types/WorkFlowEdges";



/* The following policies are implemented in the database level:
// 1. A node can only have one source node.
// 2. A node must be part of a workflow in order to create an edge with a workflow as a record.
// 3. A node can have multiple target nodes but only one source node
*/


class WorkflowEdges {

    static async createWorkflowEdge(workflowId: string, edge: WorkflowEdgeCreateBody) {
        const { source_node, target_node } = edge;
        const workflow_id = parseInt(workflowId);
        if (target_node === source_node) throw new ValidationError("Target node cannot be the same as the source node");
        if (!source_node || !target_node) throw new ValidationError("Source node and target node are required");

        const { data, error } = await supabase.from('workflow_edges').insert({ source_node, target_node, workflow_id }).select();
        if (error) throw new DatabaseError(error.message);
        return data;
    };

    static async updateWorkflowEdge(edge: WorkflowEdgeUpdate, edgeId: string) {
        const { target_node } = edge;
        const edgeIdNumber = parseInt(edgeId);
        if (!target_node) throw new ValidationError("Target node is required");
        const { data, error } = await supabase.from('workflow_edges').update({ target_node }).eq('id', edgeIdNumber).select();
        if (error) throw new DatabaseError(error.message);
        if (!data || data.length === 0) throw new NotFoundError("Edge not found");
        return data;
    }

    static async removeWorkflowEdge(edgeId: string) {
        const edgeIdNumber = parseInt(edgeId);
        const { data, error } = await supabase.from('workflow_edges').delete().eq('id', edgeIdNumber).select();
        if (error) throw new DatabaseError(error.message);
        if (!data || data.length === 0) throw new NotFoundError("Edge not found");
        return data;
    }

    static async getAllWorkflowEdges(workflowId: string) {
        const workflowIdNumber = parseInt(workflowId);
        const { data, error } = await supabase.from('workflow_edges').select('*').eq('workflow_id', workflowIdNumber);
        if (error) throw new DatabaseError(error.message);
        if (!data || data.length === 0) throw new NotFoundError("Edges not found");
        return data;
    }


    static async getWorkflowSourceNodeEdges(sourceNodeId: string) {
        const sourceNodeIdNumber = parseInt(sourceNodeId);
        const { data, error } = await supabase.from('workflow_edges').select('*').eq('source_node', sourceNodeIdNumber);
        if (error) throw new DatabaseError(error.message);
        if (!data || data.length === 0) throw new NotFoundError("Edge not found");
        return data;
    }

}

export default WorkflowEdges;