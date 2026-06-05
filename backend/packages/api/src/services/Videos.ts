import type { VideoRow } from "@ondeckai/shared/types/Videos";
import type { VideoWithDelivery } from "@ondeckai/shared/types/VideoApi";
import { DatabaseError, NotFoundError, ValidationError } from "../errors/errors.js";
import { supabase } from "../integrations/supabase.js";
import {
    buildObjectKey,
    deleteVideoObject,
    uploadVideoObject,
} from "../integrations/supabaseStorage.js";
import { enrichVideo, enrichVideos } from "../utils/videoDelivery.js";

export type VideoCreatePayload = {
    duration: number;
    fps: number;
    format: string;
    videoUrl: string;
    width?: number | null;
    height?: number | null;
    size?: number | null;
};

export type VideoUploadPayload = {
    buffer: Buffer;
    originalName: string;
    contentType: string;
    duration: number;
    fps: number;
    format: string;
    width?: number | null;
    height?: number | null;
    size?: number | null;
};

function normalizeDurationSeconds(duration: number): number {
    if (!Number.isFinite(duration) || duration <= 0) {
        throw new ValidationError("duration must be a positive number");
    }

    return Math.round(duration);
}

class VideosService {
    static async uploadVideo(
        userId: string,
        payload: VideoUploadPayload,
    ): Promise<VideoWithDelivery> {
        const { buffer, originalName, contentType, duration, fps, format, width, height, size } =
            payload;

        const durationSeconds = normalizeDurationSeconds(duration);

        if (!buffer.length || !fps || !format) {
            throw new ValidationError("file, duration, fps, and format are required");
        }

        const objectKey = buildObjectKey(userId, originalName);
        const storageKey = await uploadVideoObject(objectKey, buffer, contentType);

        try {
            const video = await VideosService.createVideo(userId, {
                duration: durationSeconds,
                fps,
                format,
                videoUrl: storageKey,
                width: width ?? null,
                height: height ?? null,
                size: size ?? buffer.length,
            });

            return enrichVideo(video);
        } catch (error) {
            await deleteVideoObject(storageKey).catch(() => undefined);
            throw error;
        }
    }

    static async createVideo(userId: string, payload: VideoCreatePayload): Promise<VideoRow> {
        const { duration, fps, format, videoUrl, width, height, size } = payload;

        const durationSeconds = normalizeDurationSeconds(duration);

        if (!fps || !format || !videoUrl) {
            throw new ValidationError("duration, fps, format, and videoUrl are required");
        }

        const { data, error } = await supabase
            .from("videos")
            .insert({
                duration: durationSeconds,
                fps,
                width: width ?? null,
                height: height ?? null,
                size: size ?? null,
                format,
                video_url: videoUrl,
                user_id: userId,
            })
            .select()
            .single();

        if (error) throw new DatabaseError(error.message);
        return data;
    }

    static async getAllVideos(userId: string): Promise<VideoWithDelivery[]> {
        const { data, error } = await supabase
            .from("videos")
            .select("*")
            .eq("user_id", userId)
            .order("id", { ascending: false });

        if (error) throw new DatabaseError(error.message);
        return enrichVideos(data ?? []);
    }

    static async getVideoById(userId: string, videoId: number): Promise<VideoWithDelivery> {
        const { data, error } = await supabase
            .from("videos")
            .select("*")
            .eq("id", videoId)
            .eq("user_id", userId)
            .single();

        if (error) throw new DatabaseError(error.message);
        if (!data) throw new NotFoundError("Video not found");
        return enrichVideo(data);
    }

    static async deleteVideo(userId: string, videoId: number): Promise<VideoWithDelivery> {
        const existing = await VideosService.getVideoById(userId, videoId);

        const { error } = await supabase.from("videos").delete().eq("id", videoId);

        if (error) throw new DatabaseError(error.message);

        await deleteVideoObject(existing.video_url).catch(() => undefined);
        return existing;
    }
}

export default VideosService;
