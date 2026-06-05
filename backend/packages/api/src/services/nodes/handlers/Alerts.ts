import { supabase } from "../../../integrations/supabase.js";
import { NodeTypes } from "@ondeckai/shared/types/Nodes";
import { ValidationError, DatabaseError } from "../../../errors/errors.js";
import { generateContentWithVideo } from "../../../integrations/geminiVideoCache.js";
import type { NodeRunInput, WorkflowRunContext } from "../../../types/WorkflowNodes.js";

class AlertNode {
    static readonly type: NodeTypes = "alert_node";

    static async run(ctx: WorkflowRunContext, input: NodeRunInput) {
        const channel = (input.config.channel as "slack" | "gmail") ?? "slack";
        const alertRules =
            (input.config.alertRules as string) ||
            (input.config["Alert rules"] as string) ||
            "";

        return AlertNode.execute(
            ctx.video.video_url,
            input.executionNodeId,
            input.startedAt,
            ctx.videoId,
            channel,
            alertRules
        );
    }

    static async execute(
        videoUrl: string,
        executionNodeId: number,
        startedAt: string,
        videoId: number,
        channel: "slack" | "gmail",
        alertRules: string
    ): Promise<{ messageSent: string; channel: "slack" | "gmail" }> {
        const response = await generateContentWithVideo(
            videoId,
            videoUrl,
            `Based on the user provided rules: ${alertRules}, detect if the video contains any of the rules. If so, create a message to send to the user through ${channel}.`,
            { responseMimeType: "application/json" },
        );

        const responseText = response.text;
        const completedAt = new Date().toISOString();

        if (!responseText) throw new ValidationError("No response provided by the AI model");

        const { error } = await supabase.from("alerts").insert({
            channel: channel,
            message: responseText,
            sent_status: "completed",
            started_at: startedAt,
            completed_at: completedAt,
            execution_node: executionNodeId,
        });

        if (error) throw new DatabaseError(error.message);

        return { messageSent: responseText, channel };
    }
}

export default AlertNode;
