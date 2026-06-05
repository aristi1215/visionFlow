import { NodeTypes } from "@ondeckai/shared/types/Nodes";
import type { VideoRow, VideoUploadInput } from "@ondeckai/shared/types/Videos";
import { supabase } from "../../../integrations/supabase.js";
import { DatabaseError, ValidationError } from "../../../errors/errors.js";

class UploadVideoNode {

    static readonly type: NodeTypes = "upload_video";
    static async execute(videoData: VideoUploadInput): Promise<VideoRow> {

        /*
        The video should be uploaded to S3 and optimized through cloudinary directly in the frontend.
        This method represent one of the functionalities of the workflow.
            Is does:
            1. Uploads the video metadata to the database.
            2. Returns the video URL to the next node.
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