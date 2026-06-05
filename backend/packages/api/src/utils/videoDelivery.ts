import type { VideoRow } from "@ondeckai/shared/types/Videos";
import type { VideoWithDelivery } from "@ondeckai/shared/types/VideoApi";
import { resolveVideoSourceUrl } from "../integrations/supabaseStorage.js";

// TODO: Cloudinary fetch delivery for on-demand video optimization is not wired up yet.
// See integrations/cloudinary.ts — once implemented, use buildVideoDeliveryUrl() here
// for playbackUrl and workflow video URLs instead of the raw Supabase source URL.

export function enrichVideo(video: VideoRow): VideoWithDelivery {
    const sourceUrl = resolveVideoSourceUrl(video.video_url);

    return {
        ...video,
        // TODO: replace with Cloudinary delivery URL when fetch delivery is implemented.
        playbackUrl: sourceUrl,
        sourceUrl,
    };
}

export function enrichVideos(videos: VideoRow[]): VideoWithDelivery[] {
    return videos.map(enrichVideo);
}

export function resolveWorkflowVideoUrl(videoUrl: string): string {
    // TODO: return Cloudinary delivery URL once fetch delivery is implemented.
    return resolveVideoSourceUrl(videoUrl);
}
