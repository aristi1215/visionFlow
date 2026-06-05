import { NodeTypes } from "@ondeckai/shared/types/Nodes";
import type { VideoRow, VideoUploadInput } from "@ondeckai/shared/types/Videos";
import { supabase } from "../../../integrations/supabase.js";
import { DatabaseError, ValidationError } from "../../../errors/errors.js";

class UploadVideoNode {

    static readonly type: NodeTypes = "upload_video";
    static async execute(videoData: VideoUploadInput): Promise<VideoRow> {

        /*
        Videos are uploaded to Supabase Storage via the API. This node persists
        metadata and returns the stored video reference to downstream nodes.

        TODO: Cloudinary fetch delivery for on-demand optimization is not implemented
        yet — see integrations/cloudinary.ts and utils/videoDelivery.ts.
        */

        const { duration, fps, width, height, size, format, videoUrl, userId } = videoData;

        if (!duration || !fps || !format || !videoUrl || !userId) {
            throw new ValidationError("All video data is required");
        }

        const { data, error } = await supabase.from('videos').insert({
            duration,
            fps,
            width,
            height,
            size,
            format,
            video_url: videoUrl,
            user_id: userId,
        }).select().single();

        if(error) throw new DatabaseError(error.message);


        return data;
    }
}
export default UploadVideoNode;