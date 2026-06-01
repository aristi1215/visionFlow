import { Router } from "express";
import WorkflowRouter from "../routes/WorkflowRouter.js";
import NodesRouter from "../routes/NodesRouter.js";
import WorkflowEdgesRouter from "../routes/WorkflowEdgesRouter.js";

const router = Router();

router.use("/workflows", WorkflowRouter);
router.use("/nodes", NodesRouter);
router.use("/edges", WorkflowEdgesRouter);

export default router;
 