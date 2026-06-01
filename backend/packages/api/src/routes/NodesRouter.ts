import { Router } from "express";
import NodeController from "../controllers/Nodes/NodeController.js";
import catchAsync from "../errors/catchAsync.js";

const router = Router();


router.route('/workflows/:workflowId')
.get(catchAsync(NodeController.getAllNodesByWorkflowId))

router.route('/')
.post(catchAsync(NodeController.createNode))


router.route('/:id')
.get(catchAsync(NodeController.getNodeById))
.patch(catchAsync(NodeController.updateNode))
.delete(catchAsync(NodeController.removeNode))

router.route('/:id/execution-history')
.get(catchAsync(NodeController.getNodeExecutionHistory))

export default router;