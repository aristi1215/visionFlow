import { getDanglingNodeIds, topologicalSort } from "../../utils/helpers.js";

export type WorkflowGraph = {
    adjacencyList: Record<number, number[]>;
    executionOrder: number[];
    danglingNodes: number[];
};

export function createGraph(
    nodes: { id: number }[],
    edges: { source_node: number; target_node: number }[]
): WorkflowGraph {
    const adjacencyList: Record<number, number[]> = {};

    for (const node of nodes) {
        adjacencyList[node.id] = [];
    }

    for (const edge of edges) {
        adjacencyList[edge.source_node].push(edge.target_node);
    }

    const nodeIds = nodes.map((node) => node.id);
    const danglingNodes = getDanglingNodeIds(nodeIds, edges);
    const danglingSet = new Set(danglingNodes);
    const connectedNodeIds = nodeIds.filter((id) => !danglingSet.has(id));

    const executionOrder =
        connectedNodeIds.length > 0
            ? topologicalSort(connectedNodeIds, adjacencyList)
            : [];

    return { adjacencyList, executionOrder, danglingNodes };
}
