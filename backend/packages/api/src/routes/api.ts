import { Router } from "express";
import WorkflowRouter from "../routes/WorkflowRouter.js";
import NodesRouter from "../routes/NodesRouter.js";
import WorkflowEdgesRouter from "../routes/WorkflowEdgesRouter.js";
import { clerkMiddleware,getAuth } from "@clerk/express";
import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../errors/errors.js";
import WorkflowEngineRouter from "../routes/WorkflowEngineRouter.js";
import VideosRouter from "../routes/VideosRouter.js";
import ExecutionsRouter from "../routes/ExecutionsRouter.js";
 
const router = Router();
router.use(clerkMiddleware());

const checkAuth = (req: Request, _res: Response, next: NextFunction) => {
    const {userId} = getAuth(req);
    if(!userId) throw new UnauthorizedError("Unauthorized");
    next();
}

router.use("/workflows", checkAuth, WorkflowRouter);
router.use("/nodes", checkAuth, NodesRouter);
router.use("/edges", checkAuth, WorkflowEdgesRouter);
router.use("/engine", checkAuth, WorkflowEngineRouter);
router.use("/videos", checkAuth, VideosRouter);
router.use("/executions", checkAuth, ExecutionsRouter);

export default router;
 