import { Router } from "express";
import WorkflowController from "../controllers/WorkflowController.js";
import { clerkMiddleware } from "@clerk/express";
import catchAsync from "../errors/catchAsync.js";



const router = Router();

router.use(clerkMiddleware());


router.route('/')
.get(catchAsync(WorkflowController.getAllWorkflows))
.post(catchAsync(WorkflowController.createWorkflow))

router.route('/:workflowId')
.get(catchAsync(WorkflowController.getWorkflowById))
.put(catchAsync(WorkflowController.updateWorkflow))
.delete(catchAsync(WorkflowController.deleteWorkflow)) 

export default router;