import type { Request } from "express";
import multer, { type FileFilterCallback } from "multer";

const MAX_VIDEO_SIZE_BYTES = 500 * 1024 * 1024;

export const uploadVideoMiddleware = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: MAX_VIDEO_SIZE_BYTES },
    fileFilter: (_req: Request, file: Express.Multer.File, cb: FileFilterCallback) => {
        if (!file.mimetype.startsWith("video/")) {
            cb(new Error("Only video files are allowed"));
            return;
        }

        cb(null, true);
    },
}).single("file");
