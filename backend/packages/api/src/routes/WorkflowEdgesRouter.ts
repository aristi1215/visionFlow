import { Router } from "express";
import WorkflowEdgesController from "../controllers/WorkflowEdgesController.js";
import catchAsync from "../errors/catchAsync.js";



const router = Router({ mergeParams: true });

router.route('/')
.get(catchAsync(WorkflowEdgesController.getAllWorkflowEdgesByWorkflowId))
.post(catchAsync(WorkflowEdgesController.createWorkflowEdge))


router.route('/:id')
.get(catchAsync(WorkflowEdgesController.getWorkflowSourceNodeEdges))
.patch(catchAsync(WorkflowEdgesController.updateWorkflowEdge))
.delete(catchAsync(WorkflowEdgesController.removeWorkflowEdge))

export default router;

