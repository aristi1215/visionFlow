import { Request, Response } from "express";
import { getAuth } from "@clerk/express";
import VideosService from "../services/Videos.js";
import { formatRequestParamsToNumber } from "../utils/helpers.js";
import { ValidationError } from "../errors/errors.js";

class VideoController {
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

        return res.status(201).json({ status: "success", data: video });
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
