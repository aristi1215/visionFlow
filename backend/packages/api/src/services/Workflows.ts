import { supabase } from "../integrations/supabase.js";

interface WorkflowInterface {
    id: string;
    user_id: string;
    name: string;
    description: string;
    started_at: string;
    completed_at: string;
    status: string;
}


class Workflow {

    static async createWorkflow(workflow: WorkflowInterface) {};
    static async updateWorkflow(id: string, workflow: WorkflowInterface){};
    static async getAllWorkflows(){};
    static async getWorkflowById(id: string){};
    static async deleteWorkflow(id: string){};

    static async executeWorkflow(id: string){};
    static async stopWorkflowExecution(id: string){};
    
    static async getWorkflowExecutionHistory(id: string){};


}

export default Workflow;