import { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import VideosService from "../services/Videos.js";
import { formatRequestParamsToNumber } from "../utils/helpers.js";
import { ValidationError } from "../errors/errors.js";
import { enrichVideo } from "../utils/videoDelivery.js";

class VideoController {
    static async uploadVideo(req: Request, res: Response) {
        const { userId } = getAuth(req);
        if (!userId) return res.status(401).json({ status: "error", message: "Unauthorized" });

        const file = req.file;
        if (!file) {
            throw new ValidationError("A video file is required");
        }

        const duration = Number(req.body?.duration);
        const fps = Number(req.body?.fps);
        const format =
            typeof req.body?.format === "string" && req.body.format
                ? req.body.format
                : file.originalname.split(".").pop() || "mp4";

        const video = await VideosService.uploadVideo(userId, {
            buffer: file.buffer,
            originalName: file.originalname,
            contentType: file.mimetype,
            duration,
            fps,
            format,
            width: req.body?.width != null ? Number(req.body.width) : null,
            height: req.body?.height != null ? Number(req.body.height) : null,
            size: file.size,
        });

        return res.status(201).json({ status: "success", data: video });
    }

    static async createVideo(req: Request, res: Response) {
        const { userId } = getAuth(req);
        if (!userId) return res.status(401).json({ status: "error", message: "Unauthorized" });

        const { duration, fps, format, videoUrl, width, height, size } = req.body ?? {};

        if (!videoUrl || typeof videoUrl !== "string") {
            throw new ValidationError("videoUrl is required");
        }

        const video = await VideosService.createVideo(userId, {
            duration: Number(duration),
            fps: Number(fps),
            format: String(format),
            videoUrl,
            width: width != null ? Number(width) : null,
            height: height != null ? Number(height) : null,
            size: size != null ? Number(size) : null,
        });

        return res.status(201).json({ status: "success", data: enrichVideo(video) });
    }

    static async getAllVideos(req: Request, res: Response) {
        const { userId } = getAuth(req);
        if (!userId) return res.status(401).json({ status: "error", message: "Unauthorized" });

        const videos = await VideosService.getAllVideos(userId);
        return res.status(200).json({ status: "success", data: { length: videos.length, videos } });
    }

    static async getVideoById(req: Request, res: Response) {
        const { userId } = getAuth(req);
        if (!userId) return res.status(401).json({ status: "error", message: "Unauthorized" });

        const videoId = formatRequestParamsToNumber(req.params.id);
        const video = await VideosService.getVideoById(userId, videoId);
        return res.status(200).json({ status: "success", data: video });
    }

    static async deleteVideo(req: Request, res: Response) {
        const { userId } = getAuth(req);
        if (!userId) return res.status(401).json({ status: "error", message: "Unauthorized" });

        const videoId = formatRequestParamsToNumber(req.params.id);
        const video = await VideosService.deleteVideo(userId, videoId);
        return res.status(200).json({ status: "success", data: video });
    }
}

export default VideoController;
