import { Router, type NextFunction, type Request, type Response } from "express";
import catchAsync from "../errors/catchAsync.js";
import VideoController from "../controllers/VideoController.js";
import { uploadVideoMiddleware } from "../middleware/uploadVideo.js";

const router = Router();

router.post(
    "/upload",
    (req: Request, res: Response, next: NextFunction) => {
        uploadVideoMiddleware(req, res, (error: unknown) => {
            if (error) next(error);
            else next();
        });
    },
    catchAsync(VideoController.uploadVideo),
);

router
    .route("/")
    .get(catchAsync(VideoController.getAllVideos))
    .post(catchAsync(VideoController.createVideo));

router
    .route("/:id")
    .get(catchAsync(VideoController.getVideoById))
    .delete(catchAsync(VideoController.deleteVideo));

export default router;
