import { supabase } from "../integrations/supabase.js";



//All workflow nodes are related to a workflow
class WorkflowNode {

    static async createWorkflowNode(workflowId: string, nodeType: string, nodeData: any){};
    static async removeWorkflowNode(workflowId: string, nodeType: string){};
    static async updateWorkflowNode(workflowId: string, nodeType: string, nodeData: any){};
    static async getWorkflowNodeById(workflowId: string, nodeType: string){};
    static async executeWorkflowNode(workflowId: string, nodeType: string){};
    static async getWorkflowNodeExecutionHistory(workflowId: string, nodeType: string){};

}

export default WorkflowNode;