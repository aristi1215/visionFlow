import type { Json } from "@ondeckai/shared/database.types";
import type { WorkflowExecutionSummary } from "@ondeckai/shared/types/WorkflowExecutionSummary";
import { supabase } from "../../integrations/supabase.js";
import { DatabaseError, NotFoundError } from "../../errors/errors.js";
import type {
    NodeExecutionResult,
    WorkflowRunContext,
} from "../../types/WorkflowNodes.js";
import { createGraph } from "./createGraph.js";
import { getNodeHandler } from "./nodeRegistry.js";
import {
    buildPredecessorMap,
    resolveUpstreamOutputs,
} from "./resolveInputs.js";
// TODO: resolveWorkflowVideoUrl currently returns a direct Supabase URL.
// Switch to Cloudinary delivery once integrations/cloudinary.ts is wired up.
import { resolveWorkflowVideoUrl } from "../../utils/videoDelivery.js";

export type { WorkflowExecutionSummary };

export async function runWorkflow(
    workflowId: number,
    videoId: number
): Promise<WorkflowExecutionSummary> {
    const { data: video, error: videoError } = await supabase
        .from("videos")
        .select("*")
        .eq("id", videoId)
        .single();

    if (videoError) throw new DatabaseError(videoError.message);
    if (!video) throw new NotFoundError("Video not found");

    const startedAt = new Date().toISOString();

    const { data: execution, error: executionError } = await supabase
        .from("workflow_execution")
        .insert({
            workflow_id: workflowId,
            video_id: videoId,
            started_at: startedAt,
            status: "started",
        })
        .select("id")
        .single();

    if (executionError) throw new DatabaseError(executionError.message);

    const ctx: WorkflowRunContext = {
        executionId: execution.id,
        videoId: video.id,
        videoUrl: resolveWorkflowVideoUrl(video.video_url),
        workflowId,
        video,
    };

    const { data: workflowNodesData, error: workflowNodesError } = await supabase
        .from("workflow_nodes")
        .select("id, type, config")
        .eq("workflow_id", workflowId);

    if (workflowNodesError) throw new DatabaseError(workflowNodesError.message);
    if (!workflowNodesData?.length) {
        throw new NotFoundError("No workflow nodes found");
    }

    const { data: workflowEdgesData, error: workflowEdgesError } = await supabase
        .from("workflow_edges")
        .select("source_node, target_node")
        .eq("workflow_id", workflowId);

    if (workflowEdgesError) throw new DatabaseError(workflowEdgesError.message);

    const graph = createGraph(workflowNodesData, workflowEdgesData ?? []);
    const nodesById = new Map(
        workflowNodesData.map((node) => [
            node.id,
            {
                id: node.id,
                type: node.type,
                config: (node.config ?? {}) as Record<string, unknown>,
            },
        ])
    );
    const predecessorMap = buildPredecessorMap(workflowEdgesData ?? []);
    const outputStore = new Map<number, NodeExecutionResult>();
    const nodeResults: WorkflowExecutionSummary["nodeResults"] = [];

    try {
        for (const nodeId of graph.executionOrder) {
            const node = nodesById.get(nodeId);
            if (!node) continue;

            if (node.type === "upload_video") {
                continue;
            }

            const nodeStartedAt = new Date().toISOString();

            const { data: execNode, error: execNodeError } = await supabase
                .from("execution_nodes")
                .insert({
                    execution_id: ctx.executionId,
                    node_id: nodeId,
                    status: "started",
                    output_json: {} as Json,
                })
                .select("id")
                .single();

            if (execNodeError) throw new DatabaseError(execNodeError.message);

            const inputs = resolveUpstreamOutputs(
                nodeId,
                predecessorMap,
                outputStore,
                nodesById
            );

            const handler = getNodeHandler(node.type);
            const output = await handler.run(ctx, {
                inputs,
                config: node.config,
                executionNodeId: execNode.id,
                startedAt: nodeStartedAt,
            });

            const { error: updateExecError } = await supabase
                .from("execution_nodes")
                .update({
                    status: "completed",
                    output_json: output as Json,
                })
                .eq("id", execNode.id);

            if (updateExecError) throw new DatabaseError(updateExecError.message);

            outputStore.set(nodeId, { type: node.type, output });
            nodeResults.push({
                nodeId,
                type: node.type,
                executionNodeId: execNode.id,
                output,
            });
        }

        if (!graph.executionOrder.some((id) => nodesById.get(id)?.type === "save_results_node")) {
            await supabase
                .from("workflow_execution")
                .update({
                    status: "completed",
                    completed_at: new Date().toISOString(),
                })
                .eq("id", ctx.executionId);
        }

        const saveResultsNode = nodeResults.find((r) => r.type === "save_results_node");
        const outputReport =
            saveResultsNode?.output &&
            typeof saveResultsNode.output === "object" &&
            "output_report" in saveResultsNode.output &&
            typeof (saveResultsNode.output as { output_report?: unknown }).output_report ===
                "string"
                ? (saveResultsNode.output as { output_report: string }).output_report
                : null;

        return {
            executionId: ctx.executionId,
            workflowId,
            videoId,
            status: "completed",
            executionOrder: graph.executionOrder,
            skippedDanglingNodes: graph.danglingNodes,
            nodeResults,
            outputReport,
        };
    } catch (error) {
        await supabase
            .from("workflow_execution")
            .update({
                status: "failed",
                completed_at: new Date().toISOString(),
            })
            .eq("id", ctx.executionId);

        throw error;
    }
}
