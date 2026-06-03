import { supabase } from "../../../integrations/supabase.js";
import { ValidationError, DatabaseError } from "../../../errors/errors.js";
import { getOrCreateVideoCache } from "../../../integrations/geminiVideoCache.js";
import { NodeTypes } from "@ondeckai/shared/types/Nodes";
import { gemini } from "../../../integrations/gemini.js";
import { timelineEventsSchema } from "../../../schemas/TimelineEventsSchema.js";


const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-3.5-flash";

class TimelineNode {

    /*
        This method represent one of the functionalities of the workflow.
        Is does:
        1. Generates a structured timeline of the video.
        2. Returns the timeline to the next node.
    */

    static readonly type: NodeTypes = "timeline_events_generator";
    static async execute(videoUrl: string, executionNodeId: number, startedAt: string, videoId: number): Promise<{ output_json: string }> {
        /**
         * 
         * This method represent one of the functionalities of the workflow.
         * Is does:
         * 1. Generates a structured timeline of the video.
         * 2. Returns the timeline to the next node.
         */

        const cachedContent = await getOrCreateVideoCache(videoId, videoUrl);

        const response = await gemini.models.generateContent({
            model: GEMINI_MODEL,
            contents: `Make a timeline of the video, include timestamp of the events. Focus only on important events related to the video content.
Return ONLY valid JSON:

{
  "events": [
    {
      "event_type": "string",
      "timestamp": "string",
      "description": "string",
    }
  ]
}`,
            config: {
                cachedContent,
                responseMimeType: "application/json",
                responseSchema: timelineEventsSchema,
            },
        });


        const timeLineEvents = response.text;
        const completedAt = new Date().toISOString();

        if (!timeLineEvents) throw new ValidationError("No detections found");

        const { error } = await supabase.from('timeline_events').insert({
            execution_node: executionNodeId,
            started_at: startedAt,
            completed_at: completedAt,
            output_json: timeLineEvents,
        });

        if (error) throw new DatabaseError(error.message);

        return { output_json: timeLineEvents };
    }


}

export default TimelineNode;