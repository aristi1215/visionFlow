import { Request, Response } from "express";
import WorkflowService from "../services/Workflows.js";
import { getAuth } from "@clerk/express";
import type { WorkflowRequest, WorkflowUpdateRequest } from "../types/WorkflowRequests.js";




class WorkflowController {

    static async createWorkflow(req: WorkflowRequest, res: Response){

        const {name, description} = req.body; 
        const {userId} = getAuth(req);
        const created_at = new Date().toISOString();

        if(!userId) return res.status(401).json({status: 'error', message: "Unauthorized"});
 
        const workflow = await WorkflowService.createWorkflow({created_at,name, description, user_id: userId});
       
        return res.status(201).json({status: 'success', data:{ workflow}});
    }

    static async updateWorkflow(req: WorkflowUpdateRequest, res: Response){

        const  {name, description} = req.body;
        const {workflowId} = req.params;
        const workflowIdNumber = parseInt(workflowId as string);

        const workflow = await WorkflowService.updateWorkflow({id: workflowIdNumber, name, description });
       
        return res.status(200).json({status: 'success', data:{ workflow}});
    }
    
    static async getAllWorkflows(req: Request, res: Response){
        const {userId} = getAuth(req)
        if(!userId) return res.status(401).json({message: "Unauthorized"});
        const workflows = await WorkflowService.getAllWorkflows(userId);
        return res.status(200).json({status: 'success', data:{length: workflows.length, workflows}});
    } 

    static async getWorkflowById(req: Request, res: Response){
        const {workflowId} = req.params; 
        const workflowIdNumber = parseInt(workflowId as string);
        const workflow = await WorkflowService.getWorkflowById(workflowIdNumber);
        return res.status(200).json({status: 'success', data:{ workflow}});
    }

    static async deleteWorkflow(req: Request, res: Response){
        const {workflowId} = req.params;
        const workflowIdNumber = parseInt(workflowId as string);
        const workflow = await WorkflowService.deleteWorkflow(workflowIdNumber);
        return res.status(200).json({status: 'success', data:{ workflow}});
    }

} 

export default WorkflowController;