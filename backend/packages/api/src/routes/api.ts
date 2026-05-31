import { Router } from "express";
import WorkflowRouter from "../routes/WorkflowRouter.js";
import NodesRouter from "../routes/NodesRouter.js";
const router = Router();

router.use("/workflows", WorkflowRouter);
router.use("/nodes", NodesRouter);

export default router;
 