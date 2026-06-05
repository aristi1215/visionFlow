import type { NodeTypes } from "@ondeckai/shared/types/Nodes";
import type { UpstreamNodeOutput } from "../../types/WorkflowNodes.js";

export type OutputResults = {
    alertResults?: {
        channel: "slack" | "gmail";
        message: string;
    };
    timelineResults?: unknown;
    aiAnalysisResults?: {
        analysis: string;
    };
    objectDetectionResults?: unknown;
    videoAnalysisResults?: {
        analysis: string;
    };
};

export function aggregateUpstreamResults(
    inputs: UpstreamNodeOutput[]
): OutputResults {
    const results: OutputResults = {};

    for (const { type, output } of inputs) {
        const payload = output as Record<string, unknown>;

        switch (type as NodeTypes) {
            case "alert_node":
                results.alertResults = {
                    channel: (payload.channel as "slack" | "gmail") ?? "slack",
                    message: String(payload.messageSent ?? ""),
                };
                break;
            case "timeline_events_generator":
                results.timelineResults = payload.output_json
                    ? JSON.parse(String(payload.output_json))
                    : payload;
                break;
            case "ai_description_node":
                results.aiAnalysisResults = {
                    analysis: String(payload.output_response ?? ""),
                };
                break;
            case "object_detection":
                results.objectDetectionResults = payload.output_json
                    ? JSON.parse(String(payload.output_json))
                    : payload;
                break;
            default:
                break;
        }
    }

    return results;
}
