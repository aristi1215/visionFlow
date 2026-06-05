import type { NodeTypes } from "@ondeckai/shared/types/Nodes";
import type {
    NodeExecutionResult,
    UpstreamNodeOutput,
} from "../../types/WorkflowNodes.js";
import { buildPredecessorMap } from "../../utils/helpers.js";

type WorkflowNodeRow = {
    id: number;
    type: NodeTypes;
};

export function resolveUpstreamOutputs(
    nodeId: number,
    predecessorMap: Record<number, number[]>,
    outputStore: Map<number, NodeExecutionResult>,
    nodesById: Map<number, WorkflowNodeRow>
): UpstreamNodeOutput[] {
    const predecessorIds = predecessorMap[nodeId] ?? [];

    return predecessorIds.flatMap((predecessorId) => {
        const result = outputStore.get(predecessorId);
        const node = nodesById.get(predecessorId);
        if (!result || !node) {
            return [];
        }

        return [
            {
                nodeId: predecessorId,
                type: node.type,
                output: result.output,
            },
        ];
    });
}

export { buildPredecessorMap };
