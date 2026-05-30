import { Router } from "express";
import WorkflowRouter from "../routes/WorkflowRouter.js";

const router = Router();

router.use("/workflows", WorkflowRouter);

export default router;
