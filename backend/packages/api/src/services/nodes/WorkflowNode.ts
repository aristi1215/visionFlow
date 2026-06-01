import { DatabaseError, NotFoundError,ValidationError  } from "../../errors/errors.js";
import { supabase } from "../../integrations/supabase.js";
import type { NodeCreate, NodeUpdate } from "@ondeckai/shared/types/Nodes";



class WorkflowNode {

    static async createWorkflowNode(node: NodeCreate){
        const {type, workflow_id, position_x, position_y} = node;
        const {data, error} = await supabase.from('workflow_nodes').insert({type, workflow_id, position_x, position_y}).select();
        if(error) throw new DatabaseError(error.message);
        return data; 
    };


    static async removeWorkflowNode(nodeId: string){
        const nodeIdNumber = parseInt(nodeId);
        const {data, error} = await supabase.from('workflow_nodes').delete().eq('id', nodeIdNumber);
        if(error) throw new DatabaseError(error.message);
        return data; 
    };


    static async updateWorkflowNode(nodeId: string, node: NodeUpdate){
        const nodeIdNumber = parseInt(nodeId);
        const {position_x, position_y} = node;
        if(!position_x && !position_y) throw new ValidationError("Position X or Y are required");
        const {data, error} = await supabase.from('workflow_nodes').update({position_x, position_y}).eq('id', nodeIdNumber).select();
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
        if(!data || data.length === 0) throw new NotFoundError("Nodes not found");
        return data;
    };

    

}

export default WorkflowNode;