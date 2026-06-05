import { NodeTypes } from "@ondeckai/shared/types/Nodes";
import { supabase } from "../../../integrations/supabase.js";
import { DatabaseError } from "../../../errors/errors.js";
import { gemini } from "../../../integrations/gemini.js";
import { getOrCreateVideoCache } from "../../../integrations/geminiVideoCache.js";
import type { NodeRunInput, WorkflowRunContext } from "../../../types/WorkflowNodes.js";
import {
    aggregateUpstreamResults,
    type OutputResults,
} from "../../workflow/aggregateResults.js";

const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-3.5-flash";

class OutputResultsNode {
    static readonly type: NodeTypes = "save_results_node";

    static async run(ctx: WorkflowRunContext, input: NodeRunInput) {
        const results = aggregateUpstreamResults(input.inputs);
        return OutputResultsNode.execute(ctx.executionId, results, ctx.video);
    }

    static async execute(
        executionWorkflowId: number,
        results: OutputResults,
        videoInformation: WorkflowRunContext["video"]
    ) {
        const structuredTextReportPrompt = `
        # Video Analysis Report
        ## Summary
        - Video Url: ${videoInformation.video_url}
        - Video Duration: ${videoInformation.duration}

        # All the information received by the node workflows:
            Create a structured section for each node workflow.
            These are the workflows results: ${JSON.stringify(results)}
        `;

        const cachedContent = await getOrCreateVideoCache(
            videoInformation.id,
            videoInformation.video_url
        );

        const response = await gemini.models.generateContent({
            model: GEMINI_MODEL,
            contents: structuredTextReportPrompt,
            config: {
                cachedContent,
                responseMimeType: "text/plain",
            },
        });

        const structuredTextReport = response.text;
        const completedAt = new Date().toISOString();

        const { error } = await supabase
            .from("workflow_execution")
            .update({
                output_report: structuredTextReport,
                completed_at: completedAt,
                status: "completed",
            })
            .eq("id", executionWorkflowId);

        if (error) throw new DatabaseError(error.message);

        return { output_report: structuredTextReport };
    }
}

export default OutputResultsNode;
