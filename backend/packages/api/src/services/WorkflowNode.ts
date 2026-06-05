import { DatabaseError, NotFoundError,ValidationError  } from "../errors/errors.js";
import { supabase } from "../integrations/supabase.js";
import type { NodeCreate, NodeUpdate } from "@ondeckai/shared/types/Nodes";


//Main workflowNode class.

class WorkflowNode {

    static async createWorkflowNode(node: NodeCreate){
        const {type, workflow_id, position_x, position_y, config} = node;
        const {data, error} = await supabase.from('workflow_nodes').insert({
            type,
            workflow_id,
            position_x,
            position_y,
            config: config ?? {},
        }).select();
        if(error) throw new DatabaseError(error.message);
        return data; 
    };


    static async removeWorkflowNode(nodeId: string){
        const nodeIdNumber = parseInt(nodeId);

        const { data: executionNodes, error: executionNodesError } = await supabase
            .from("execution_nodes")
            .select("id")
            .eq("node_id", nodeIdNumber);
        if (executionNodesError) throw new DatabaseError(executionNodesError.message);

        const executionNodeIds = (executionNodes ?? []).map((node) => node.id);
        if (executionNodeIds.length > 0) {
            const dependentTables = ["alerts", "detections", "timeline_events", "video_analysis"] as const;
            for (const table of dependentTables) {
                const { error } = await supabase.from(table).delete().in("execution_node", executionNodeIds);
                if (error) throw new DatabaseError(error.message);
            }

            const { error: deleteExecutionNodesError } = await supabase
                .from("execution_nodes")
                .delete()
                .eq("node_id", nodeIdNumber);
            if (deleteExecutionNodesError) throw new DatabaseError(deleteExecutionNodesError.message);
        }

        const { error: sourceEdgesError } = await supabase
            .from("workflow_edges")
            .delete()
            .eq("source_node", nodeIdNumber);
        if (sourceEdgesError) throw new DatabaseError(sourceEdgesError.message);

        const { error: targetEdgesError } = await supabase
            .from("workflow_edges")
            .delete()
            .eq("target_node", nodeIdNumber);
        if (targetEdgesError) throw new DatabaseError(targetEdgesError.message);

        const { data, error } = await supabase
            .from("workflow_nodes")
            .delete()
            .eq("id", nodeIdNumber)
            .select();
        if (error) throw new DatabaseError(error.message);
        if (!data || data.length === 0) throw new NotFoundError("Node not found");
        return data;
    };


    static async updateWorkflowNode(nodeId: string, node: NodeUpdate){
        const nodeIdNumber = parseInt(nodeId);
        const {position_x, position_y, config} = node;
        if (position_x === undefined && position_y === undefined && config === undefined) {
            throw new ValidationError("At least one of position_x, position_y, or config is required");
        }
        const {data, error} = await supabase.from('workflow_nodes').update({
            ...(position_x !== undefined && { position_x }),
            ...(position_y !== undefined && { position_y }),
            ...(config !== undefined && { config }),
        }).eq('id', nodeIdNumber).select();
        if(error) throw new DatabaseError(error.message);
        if(!data || data.length === 0) throw new NotFoundError("Node not found");
        return data;
    }; 

    static async getWorkflowNodeById(nodeId: string){
        const nodeIdNumber = parseInt(nodeId);
        const { data, error } = await supabase.from('workflow_nodes').select('*').eq('id', nodeIdNumber);
        if(error) throw new DatabaseError(error.message);
        if(!data || data.length === 0) throw new NotFoundError("Node not found");
        return data;
    };

    static async getWorkflowNodeExecutionHistory(nodeId: string){
        const nodeIdNumber = parseInt(nodeId); 
        const {data, error} = await supabase.from('execution_nodes').select('*').eq('node_id', nodeIdNumber);
        if(error) throw new DatabaseError(error.message);
        if(!data || data.length === 0) throw new NotFoundError("Execution history not found");
        return data;
    }; 

    static async getAllNodesByWorkflowId(workflowId: string){
        const workflowIdNumber = parseInt(workflowId);
        const {data, error} = await supabase.from('workflow_nodes').select('*').eq('workflow_id', workflowIdNumber);
        if(error) throw new DatabaseError(error.message);
        return data ?? [];
    };

    

}

export default WorkflowNode;