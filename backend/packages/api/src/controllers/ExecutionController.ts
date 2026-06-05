import { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import ExecutionsService from "../services/Executions.js";
import WorkflowService from "../services/Workflows.js";
import { formatRequestParamsToNumber } from "../utils/helpers.js";
import { NotFoundError } from "../errors/errors.js";

class ExecutionController {
    static async getWorkflowExecutions(req: Request, res: Response) {
        const { userId } = getAuth(req);
        if (!userId) return res.status(401).json({ status: "error", message: "Unauthorized" });

        const workflowId = formatRequestParamsToNumber(req.params.workflowId);
        const workflows = await WorkflowService.getWorkflowById(workflowId);
        const workflow = workflows[0];
        if (!workflow || workflow.user_id !== userId) {
            throw new NotFoundError("Workflow not found");
        }

        const executions = await ExecutionsService.getExecutionsByWorkflowId(workflowId);
        return res.status(200).json({
            status: "success",
            data: { length: executions.length, executions },
        });
    }

    static async getRecentExecutions(req: Request, res: Response) {
        const { userId } = getAuth(req);
        if (!userId) return res.status(401).json({ status: "error", message: "Unauthorized" });

        const executions = await ExecutionsService.getRecentExecutionsForUser(userId);
        return res.status(200).json({
            status: "success",
            data: { length: executions.length, executions },
        });
    }

    static async getExecutionById(req: Request, res: Response) {
        const { userId } = getAuth(req);
        if (!userId) return res.status(401).json({ status: "error", message: "Unauthorized" });

        const executionId = formatRequestParamsToNumber(req.params.executionId);
        const execution = await ExecutionsService.getExecutionById(executionId);

        const workflows = await WorkflowService.getWorkflowById(execution.workflow_id);
        const workflow = workflows[0];
        if (!workflow || workflow.user_id !== userId) {
            throw new NotFoundError("Execution not found");
        }

        return res.status(200).json({ status: "success", data: execution });
    }
}

export default ExecutionController;
