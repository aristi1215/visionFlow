/**
 * Cloudinary video delivery (fetch-based optimization).
 *
 * TODO: This integration is not wired up yet. Playback, workflow execution, and
 * Gemini currently use direct public Supabase Storage URLs instead.
 *
 * When implementing:
 * - Use buildVideoDeliveryUrl() in utils/videoDelivery.ts for playbackUrl.
 * - Decide whether Gemini should receive Cloudinary URLs or continue using
 *   direct Supabase / Gemini Files API uploads.
 * - Requires CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET.
 */
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true,
});

/** TODO: Wire this into videoDelivery.ts once Cloudinary fetch delivery is ready. */
export function buildVideoDeliveryUrl(sourceUrl: string): string {
    return cloudinary.url(sourceUrl, {
        resource_type: "video",
        type: "fetch",
        transformation: [{ quality: "auto", fetch_format: "auto" }],
        secure: true,
    });
}
