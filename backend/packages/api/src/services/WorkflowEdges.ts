import { supabase } from "../integrations/supabase.js";
import { DatabaseError, NotFoundError,ValidationError } from "../errors/errors.js";
import type { WorkflowEdgeCreate, WorkflowEdgeUpdate } from "@ondeckai/shared/types/WorkFlowEdges";


class WorkflowEdges {

    static async createWorkflowEdge(edge: WorkflowEdgeCreate){
        const {source_node, target_node, workflow_id} = edge;
        if(!source_node || !target_node || !workflow_id) throw new ValidationError("Source node, target node and workflow id are required");
        const {data, error} = await supabase.from('workflow_edges').insert({source_node, target_node, workflow_id}).select();
        if(error) throw new DatabaseError(error.message);
        return data;
    };

    static async updateWorkflowEdge(edge: WorkflowEdgeUpdate, edgeId: string){
        const {target_node} = edge;
        const edgeIdNumber = parseInt(edgeId);
        if(!target_node) throw new ValidationError("Target node is required");
        const {data, error} = await supabase.from('workflow_edges').update({target_node}).eq('id', edgeIdNumber).select();
        if(error) throw new DatabaseError(error.message);
        if(!data || data.length === 0) throw new NotFoundError("Edge not found");
        return data; 
    }

    static async removeWorkflowEdge(edgeId: string){
        const edgeIdNumber = parseInt(edgeId);
        const {data, error} = await supabase.from('workflow_edges').delete().eq('id', edgeIdNumber).select();
        if(error) throw new DatabaseError(error.message);
        if(!data || data.length === 0) throw new NotFoundError("Edge not found");
        return data;
    }

    static async getAllWorkflowEdges(workflowId: string){
        const workflowIdNumber = parseInt(workflowId);
        const {data, error} = await supabase.from('workflow_edges').select('*').eq('workflow_id', workflowIdNumber);
        if(error) throw new DatabaseError(error.message);
        if(!data || data.length === 0) throw new NotFoundError("Edges not found");
        return data;
    }

    static async getWorkflowEdgeById(edgeId: string){
        const edgeIdNumber = parseInt(edgeId);
        const {data, error} = await supabase.from('workflow_edges').select('*').eq('id', edgeIdNumber);
        if(error) throw new DatabaseError(error.message);
        if(!data || data.length === 0) throw new NotFoundError("Edge not found");
        return data;
    }
}

export default WorkflowEdges;