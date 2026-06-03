import { NodeTypes } from "@ondeckai/shared/types/Nodes";
import { supabase } from "../../../integrations/supabase.js";
import { DatabaseError, ValidationError } from "../../../errors/errors.js";
import { gemini } from "../../../integrations/gemini.js";
import { getOrCreateVideoCache } from "../../../integrations/geminiVideoCache.js";
import { objectDetectionSchema } from "../../../schemas/NodesSchemas.js";

const GEMINI_MODEL = "gemini-3.5-flash";

class ObjectDetectionNode {

    static readonly type: NodeTypes = "object_detection";
    static async execute(videoUrl: string, executionNodeId: number, startedAt: string, videoId: number): Promise<{ output_json: string }> {
        /**
         * 
         * This method represent one of the functionalities of the workflow.
         * Is does:
         * 1. Detects objects in the video with the Gemini API.
         * 2. Returns the objects to the next node.
         */

        const cachedContent = await getOrCreateVideoCache(videoId, videoUrl);

        const response = await gemini.models.generateContent({
            model: GEMINI_MODEL,
            contents: `Detect objects in the video.
Return ONLY valid JSON:

{
  "detections": [
    {
      "object_type": "string",
      "confidence": number
    }
  ]
}`,
            config: {
                cachedContent,
                responseMimeType: "application/json",
                responseSchema: objectDetectionSchema,
            },
        });


        const detections = response.text;
        const completedAt = new Date().toISOString();

        if (!detections) throw new ValidationError("No detections found");

        const { error } = await supabase.from('detections').insert({
            execution_node: executionNodeId,
            started_at: startedAt,
            completed_at: completedAt,
            output_json: detections,
        });

        if (error) throw new DatabaseError(error.message);

        return { output_json: detections };
    }

}

export default ObjectDetectionNode;