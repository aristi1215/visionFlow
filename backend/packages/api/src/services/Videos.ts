import type { VideoRow } from "@ondeckai/shared/types/Videos";
import { DatabaseError, NotFoundError, ValidationError } from "../errors/errors.js";
import { supabase } from "../integrations/supabase.js";

export type VideoCreatePayload = {
    duration: number;
    fps: number;
    format: string;
    videoUrl: string;
    width?: number | null;
    height?: number | null;
    size?: number | null;
};

class VideosService {
    static async createVideo(userId: string, payload: VideoCreatePayload): Promise<VideoRow> {
        const { duration, fps, format, videoUrl, width, height, size } = payload;

        if (!duration || !fps || !format || !videoUrl) {
            throw new ValidationError("duration, fps, format, and videoUrl are required");
        }

        const { data, error } = await supabase
            .from("videos")
            .insert({
                duration,
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

    static async getAllVideos(userId: string): Promise<VideoRow[]> {
        const { data, error } = await supabase
            .from("videos")
            .select("*")
            .eq("user_id", userId)
            .order("id", { ascending: false });

        if (error) throw new DatabaseError(error.message);
        return data ?? [];
    }

    static async getVideoById(userId: string, videoId: number): Promise<VideoRow> {
        const { data, error } = await supabase
            .from("videos")
            .select("*")
            .eq("id", videoId)
            .eq("user_id", userId)
            .single();

        if (error) throw new DatabaseError(error.message);
        if (!data) throw new NotFoundError("Video not found");
        return data;
    }

    static async deleteVideo(userId: string, videoId: number): Promise<VideoRow> {
        const existing = await VideosService.getVideoById(userId, videoId);

        const { error } = await supabase.from("videos").delete().eq("id", videoId);

        if (error) throw new DatabaseError(error.message);
        return existing;
    }
}

export default VideosService;
