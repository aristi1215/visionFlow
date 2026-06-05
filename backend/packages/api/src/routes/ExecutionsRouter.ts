import { Router } from "express";
import catchAsync from "../errors/catchAsync.js";
import ExecutionController from "../controllers/ExecutionController.js";

const router = Router();

router.get("/", catchAsync(ExecutionController.getRecentExecutions));
router.get("/:executionId", catchAsync(ExecutionController.getExecutionById));

export default router;
