import { supabase } from "../../../integrations/supabase.js";
import { NodeTypes } from "@ondeckai/shared/types/Nodes";
import { ValidationError, DatabaseError } from "../../../errors/errors.js";
import { getOrCreateVideoCache } from "../../../integrations/geminiVideoCache.js";
import { gemini } from "../../../integrations/gemini.js";
import type { NodeRunInput, WorkflowRunContext } from "../../../types/WorkflowNodes.js";

const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-3.5-flash";

class AIAnalysisNode {
    static readonly type: NodeTypes = "ai_description_node";

    static async run(ctx: WorkflowRunContext, input: NodeRunInput) {
        const prompt =
            (input.config.prompt as string) ||
            (input.config["Question / prompt"] as string) ||
            "Describe what happens in this video.";

        return AIAnalysisNode.execute(
            ctx.videoUrl,
            input.executionNodeId,
            input.startedAt,
            ctx.videoId,
            prompt
        );
    }

    static async execute(
        videoUrl: string,
        executionNodeId: number,
        startedAt: string,
        videoId: number,
        prompt: string
    ): Promise<{ output_response: string }> {
        const cachedContent = await getOrCreateVideoCache(videoId, videoUrl);

        const response = await gemini.models.generateContent({
            model: GEMINI_MODEL,
            contents: prompt,
            config: {
                cachedContent,
                responseMimeType: "application/json",
            },
        });

        const responseText = response.text;
        const completedAt = new Date().toISOString();

        if (!responseText) throw new ValidationError("No response provided by the AI model");

        const { error } = await supabase.from("video_analysis").insert({
            Analysis: responseText,
            execution_node: executionNodeId,
            started_at: startedAt,
            completed_at: completedAt,
        });

        if (error) throw new DatabaseError(error.message);

        return { output_response: responseText };
    }
}

export default AIAnalysisNode;
