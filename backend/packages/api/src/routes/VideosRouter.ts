import { Router } from "express";
import catchAsync from "../errors/catchAsync.js";
import VideoController from "../controllers/VideoController.js";

const router = Router();

router
    .route("/")
    .get(catchAsync(VideoController.getAllVideos))
    .post(catchAsync(VideoController.createVideo));

router
    .route("/:id")
    .get(catchAsync(VideoController.getVideoById))
    .delete(catchAsync(VideoController.deleteVideo));

export default router;
