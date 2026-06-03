import { supabase } from "../../../integrations/supabase.js";
import { NodeTypes } from "@ondeckai/shared/types/Nodes";
import { ValidationError, DatabaseError } from "../../../errors/errors.js";
import { getOrCreateVideoCache } from "../../../integrations/geminiVideoCache.js";
import { gemini } from "../../../integrations/gemini.js";

const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-3.5-flash";


//!TODO: Implement the alert sent.
class AlertNode {
    static readonly type: NodeTypes = "alert_node";
    static async execute(videoUrl: string, executionNodeId: number, startedAt: string, videoId: number, channel: "slack" | "gmail", alertRules: string): Promise<{ messageSent: string }> {
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
            contents: `Based on the user provided rules: ${alertRules}, detect if the video contains any of the rules. If so, create a message to send to the user through ${channel}.`,
            config: {
                cachedContent,
                responseMimeType: "application/json",
            },
        });


        const responseText = response.text;
        const completedAt = new Date().toISOString();

        if (!responseText) throw new ValidationError("No response provided by the AI model");

        const { error } = await supabase.from('alerts').insert({
            channel: channel,
            message: responseText,
            sent_status: "completed",
            started_at: startedAt,
            completed_at: completedAt,
            execution_node: executionNodeId,
        });

        if (error) throw new DatabaseError(error.message);

        return { messageSent: responseText };
    }


}
export default AlertNode; 