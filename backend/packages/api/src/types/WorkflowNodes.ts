import type { NodeTypes } from "@ondeckai/shared/types/Nodes";
import type { VideoRow } from "@ondeckai/shared/types/Videos";

export type WorkflowRunContext = {
    executionId: number;
    videoId: number;
    videoUrl: string;
    workflowId: number;
    video: VideoRow;
};

export type NodeExecutionResult = {
    type: NodeTypes;
    output: unknown;
};

export type UpstreamNodeOutput = {
    nodeId: number;
    type: NodeTypes;
    output: unknown;
};

export type NodeRunInput = {
    inputs: UpstreamNodeOutput[];
    config: Record<string, unknown>;
    executionNodeId: number;
    startedAt: string;
};

export type NodeHandlerClass = {
    readonly type: NodeTypes;
    run: (ctx: WorkflowRunContext, input: NodeRunInput) => Promise<unknown>;
};
