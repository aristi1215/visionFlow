import { Router } from "express";
import WorkflowController from "../controllers/WorkflowController.js";
import { clerkMiddleware } from "@clerk/express";
import catchAsync from "../errors/catchAsync.js";
import WorkflowEdgesRouter from "./WorkflowEdgesRouter.js";



const router = Router();

router.use(clerkMiddleware());

router.use('/:workflowId/edges', WorkflowEdgesRouter);

router.route('/')
.get(catchAsync(WorkflowController.getAllWorkflows))
.post(catchAsync(WorkflowController.createWorkflow))

router.route('/:workflowId')
.get(catchAsync(WorkflowController.getWorkflowById))
.patch(catchAsync(WorkflowController.updateWorkflow))
.delete(catchAsync(WorkflowController.deleteWorkflow)) 

export default router;