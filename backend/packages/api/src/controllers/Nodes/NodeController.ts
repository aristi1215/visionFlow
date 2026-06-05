import { Request, Response } from "express";
import type { NodeRequest, NodeUpdateRequest } from "../../types/NodeRequests.js";
import WorkflowNode from "../../services/WorkflowNode.js";


class NodeController {

    static async createNode(req: NodeRequest, res: Response){
        const {type, workflow_id, position_x, position_y, config} = req.body;
        const node = await WorkflowNode.createWorkflowNode({type, workflow_id, position_x, position_y, config});
        return res.status(201).json({status: 'success', data: node});
    };

    static async removeNode(req: NodeRequest, res: Response){
        const {id} = req.params;
        const formattedId = Array.isArray(id) ? id[0] : id;
        const node = await WorkflowNode.removeWorkflowNode(formattedId);
        return res.status(200).json({status: 'success', data: node});
    };

    static async updateNode(req: NodeUpdateRequest, res: Response){
        const {id} = req.params;
        const formattedId = Array.isArray(id) ? id[0] : id;
        const {position_x, position_y, config} = req.body;
        const node = await WorkflowNode.updateWorkflowNode(formattedId, {position_x, position_y, config});
        return res.status(200).json({status: 'success', data: node});
    };

    static async getNodeById(req: NodeRequest, res: Response){
        const {id} = req.params;
        const formattedId = Array.isArray(id) ? id[0] : id;
        const node = await WorkflowNode.getWorkflowNodeById(formattedId);
        return res.status(200).json({status: 'success', data: node});
    };

    static async getAllNodesByWorkflowId(req: Request, res: Response){
        const {workflowId} = req.params;
        const formattedWorkflowId = Array.isArray(workflowId) ? workflowId[0] : workflowId;
        const nodes = await WorkflowNode.getAllNodesByWorkflowId(formattedWorkflowId);
        return res.status(200).json({status: 'success', data: nodes});
    };
    
    static async getNodeExecutionHistory(req: NodeRequest, res: Response){
        const {id} = req.params;
        const formattedId = Array.isArray(id) ? id[0] : id;
        const node = await WorkflowNode.getWorkflowNodeExecutionHistory(formattedId);
        return res.status(200).json({status: 'success', data: node});
    };

}

export default NodeController;