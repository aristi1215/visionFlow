import { Router } from "express";
import WorkflowController from "../controllers/WorkflowController.js";
import ExecutionController from "../controllers/ExecutionController.js";
import catchAsync from "../errors/catchAsync.js";
import WorkflowEdgesRouter from "./WorkflowEdgesRouter.js";



const router = Router();

router.use('/:workflowId/edges', WorkflowEdgesRouter);
router.get('/:workflowId/executions', catchAsync(ExecutionController.getWorkflowExecutions));

router.route('/')
.get(catchAsync(WorkflowController.getAllWorkflows))
.post(catchAsync(WorkflowController.createWorkflow))

router.route('/:workflowId')
.get(catchAsync(WorkflowController.getWorkflowById))
.patch(catchAsync(WorkflowController.updateWorkflow))
.delete(catchAsync(WorkflowController.deleteWorkflow)) 

export default router;