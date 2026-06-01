import WorkflowEdges from "../services/WorkflowEdges.js";
import type { workflowEdgeRequest, workflowEdgeUpdateRequest } from "@ondeckai/shared/types/WorkFlowEdges";
import { Request, Response } from "express";

class WorkflowEdgesController {

    static async createWorkflowEdge(req: workflowEdgeRequest, res: Response){
        const {source_node, target_node} = req.body;
        const {workflowId} = req.params;
        const formattedWorkflowId = Array.isArray(workflowId) ? workflowId[0] : workflowId;
        const edge = await WorkflowEdges.createWorkflowEdge(formattedWorkflowId, {source_node, target_node});
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

    static async getWorkflowSourceNodeEdges(req: Request, res: Response){
        //represents only the source_node
        const {sourceNodeId} = req.params;
        const formattedSourceNodeId = Array.isArray(sourceNodeId) ? sourceNodeId[0] : sourceNodeId;
        const edges = await WorkflowEdges.getWorkflowSourceNodeEdges(formattedSourceNodeId);
        return res.status(200).json({status: 'success', data: edges});
    };


};


export default WorkflowEdgesController;