import { Request, Response } from "express";
import WorkflowEngine from "../services/WorkflowEngine.js";
import { formatRequestParamsToNumber } from "../utils/helpers.js";
import { ValidationError } from "../errors/errors.js";

class WorkflowEngineController {
    static async executeWorkflow(req: Request, res: Response) {
        const { workflowId } = req.params;
        const formattedWorkflowId = formatRequestParamsToNumber(workflowId);

        const videoId = req.body?.videoId;
        if (videoId === undefined || videoId === null) {
            throw new ValidationError("videoId is required in request body");
        }

        const formattedVideoId =
            typeof videoId === "number" ? videoId : parseInt(String(videoId), 10);

        if (Number.isNaN(formattedVideoId)) {
            throw new ValidationError("videoId must be a valid number");
        }

        const result = await WorkflowEngine.executeWorkflow(
            formattedWorkflowId,
            formattedVideoId
        );
        return res.status(200).json({ status: "success", data: result });
    }
}

export default WorkflowEngineController;
