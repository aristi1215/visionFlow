import type { VideoRow } from "./Videos.js";

export type VideoCreateBody = {
    duration: number;
    fps: number;
    format: string;
    videoUrl: string;
    width?: number | null;
    height?: number | null;
    size?: number | null;
};

export type VideoWithDelivery = VideoRow & {
    /** TODO: will use Cloudinary delivery URL once that integration is implemented. */
    playbackUrl: string;
    /** Direct public Supabase Storage URL used for playback and Gemini today. */
    sourceUrl: string;
};
