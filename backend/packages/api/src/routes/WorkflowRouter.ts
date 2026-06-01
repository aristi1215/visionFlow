import { Router } from "express";
import WorkflowController from "../controllers/WorkflowController.js";
import catchAsync from "../errors/catchAsync.js";
import WorkflowEdgesRouter from "./WorkflowEdgesRouter.js";



const router = Router();

router.use('/:workflowId/edges', WorkflowEdgesRouter);

router.route('/')
.get(catchAsync(WorkflowController.getAllWorkflows))
.post(catchAsync(WorkflowController.createWorkflow))

router.route('/:workflowId')
.get(catchAsync(WorkflowController.getWorkflowById))
.patch(catchAsync(WorkflowController.updateWorkflow))
.delete(catchAsync(WorkflowController.deleteWorkflow)) 

export default router;