import { Router } from "express";
import WorkflowRouter from "../routes/WorkflowRouter.js";
import NodesRouter from "../routes/NodesRouter.js";
import WorkflowEdgesRouter from "../routes/WorkflowEdgesRouter.js";
import { clerkMiddleware,getAuth } from "@clerk/express";
import { Request, Response, NextFunction } from "express";
import { UnauthorizedError } from "../errors/errors.js";
 
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

export default router;
 