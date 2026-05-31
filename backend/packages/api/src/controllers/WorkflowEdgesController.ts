import WorkflowEdges from "../services/WorkflowEdges.js";
import type { workflowEdgeRequest, workflowEdgeUpdateRequest } from "@ondeckai/shared/types/WorkFlowEdges";
import { Request, Response } from "express";

class WorkflowEdgesController {

    static async createWorkflowEdge(req: workflowEdgeRequest, res: Response){
        const {source_node, target_node, workflow_id} = req.body;
        const edge = await WorkflowEdges.createWorkflowEdge({source_node, target_node, workflow_id});
        return res.status(201).json({status: 'success', data: edge});
    };

    static async updateWorkflowEdge(req: workflowEdgeUpdateRequest, res: Response){
        const {target_node} = req.body;
        const {id} = req.params;
        const formattedId = Array.isArray(id) ? id[0] : id;
        const edge = await WorkflowEdges.updateWorkflowEdge({target_node}, formattedId);
        return res.status(200).json({status: 'success', data: edge});
    };


    static async removeWorkflowEdge(req: Request, res: Response){
        const {id} = req.params;
        const formattedId = Array.isArray(id) ? id[0] : id;
        const edge = await WorkflowEdges.removeWorkflowEdge(formattedId);
        return res.status(200).json({status: 'success', data: edge});
    };

    static async getAllWorkflowEdgesByWorkflowId(req: Request, res: Response){
        const {workflowId} = req.params;
        const formattedWorkflowId = Array.isArray(workflowId) ? workflowId[0] : workflowId;
        const edges = await WorkflowEdges.getAllWorkflowEdges(formattedWorkflowId);
        return res.status(200).json({status: 'success', data: edges});
    };

    static async getWorkflowEdgeById(req: Request, res: Response){
        //represents only the source_node
        const {id} = req.params;

    };


};


export default WorkflowEdgesController;