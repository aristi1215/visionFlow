import { supabase } from "../../../integrations/supabase.js";
import { NodeTypes } from "@ondeckai/shared/types/Nodes";
import { ValidationError, DatabaseError } from "../../../errors/errors.js";
import { generateContentWithVideo } from "../../../integrations/geminiVideoCache.js";
import type { NodeRunInput, WorkflowRunContext } from "../../../types/WorkflowNodes.js";

class AIAnalysisNode {
    static readonly type: NodeTypes = "ai_description_node";

    static async run(ctx: WorkflowRunContext, input: NodeRunInput) {
        const prompt =
            (input.config.prompt as string) ||
            (input.config["Question / prompt"] as string) ||
            "Describe what happens in this video.";

        return AIAnalysisNode.execute(
            ctx.video.video_url,
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
        const response = await generateContentWithVideo(videoId, videoUrl, prompt, {
            responseMimeType: "application/json",
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
