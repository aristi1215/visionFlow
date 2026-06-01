import { supabase } from "../integrations/supabase.js";
import { DatabaseError, NotFoundError, ValidationError } from "../errors/errors.js";
import type { WorkflowCreate, WorkflowUpdate } from "@ondeckai/shared/types/Workflows";
  

class Workflow {

    static async createWorkflow(workflow: WorkflowCreate) {
        const {data, error} = await supabase.from("workflows").insert(workflow).select();
        if(error) throw new DatabaseError(error.message);
        return data;
    }; 

    static async updateWorkflow(workflow: WorkflowUpdate){
        const workflowId = workflow.id;
        if(!workflowId) throw new ValidationError("Workflow ID is required");

        const {data, error} = await supabase.from('workflows').update(workflow).eq('id', workflowId).select();
        if(error) throw new DatabaseError(error.message);
        if(!data || data.length === 0) throw new NotFoundError("Workflow not found");

        return data;
    };

    static async getAllWorkflows(userId: string){
        const {data, error} = await supabase.from('workflows').select('*').eq('user_id', userId);
        if(error) throw new DatabaseError(error.message);
        return data;
    };

    static async getWorkflowById(id: number){
        const {data, error} = await supabase.from('workflows').select('*').eq('id', id);
        if(error) throw new DatabaseError(error.message);
        if(!data || data.length === 0) throw new NotFoundError("Workflow not found");
        return data;
    };
 

    static async deleteWorkflow(id: number){
        const {data, error} = await supabase.from('workflows').delete().eq('id', id);
        if(error) throw new DatabaseError(error.message);        
        return data;
    };

    

    static async executeWorkflow(id: string){
    };

    
    static async stopWorkflowExecution(id: string){};
    
    static async getWorkflowExecutionHistory(id: string){};


}

export default Workflow;