import { Router } from "express";
import catchAsync from "../errors/catchAsync.js";
import WorkflowEngineController from "../controllers/WorkflowEngineController.js";

const router = Router();


router.route('/:workflowId/execute').post(catchAsync(WorkflowEngineController.executeWorkflow));


export default router;