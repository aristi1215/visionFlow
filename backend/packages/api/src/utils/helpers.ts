import { ValidationError } from "../errors/errors.js";

/**
 * 
 * @param id - The id to format.
 * This function is used to format the id comming from the requests params to a number type.
 * @returns The formatted id. Number type.
 */

export const formatRequestParamsToNumber = (id: string | string[]): number => {
    return Array.isArray(id) ? parseInt(id[0]) : parseInt(id);
};

/** Nodes that appear in at least one edge (source or target). */
export function getConnectedNodeIds(
    edges: { source_node: number; target_node: number }[]
): Set<number> {
    const connected = new Set<number>();

    for (const edge of edges) {
        connected.add(edge.source_node);
        connected.add(edge.target_node);
    }

    return connected;
}

/** Nodes present in the workflow but with no edges — disconnected in the canvas. */
export function getDanglingNodeIds(
    nodeIds: number[],
    edges: { source_node: number; target_node: number }[]
): number[] {
    const connected = getConnectedNodeIds(edges);
    return nodeIds.filter((id) => !connected.has(id));
}

export function buildPredecessorMap(
    edges: { source_node: number; target_node: number }[]
): Record<number, number[]> {
    const map: Record<number, number[]> = {};

    for (const edge of edges) {
        if (!map[edge.target_node]) {
            map[edge.target_node] = [];
        }
        map[edge.target_node].push(edge.source_node);
    }

    return map;
}

export function topologicalSort(
    nodeIds: number[],
    adjacencyList: Record<number, number[]>
): number[] {
    const inDegree = new Map<number, number>();

    for (const id of nodeIds) {
        inDegree.set(id, 0);
    }

    for (const sourceId of nodeIds) {
        for (const targetId of adjacencyList[sourceId] ?? []) {
            inDegree.set(targetId, (inDegree.get(targetId) ?? 0) + 1);
        }
    }

    const queue = nodeIds.filter((id) => inDegree.get(id) === 0);
    const order: number[] = [];

    while (queue.length > 0) {
        const current = queue.shift()!;
        order.push(current);

        for (const neighbor of adjacencyList[current] ?? []) {
            const nextDegree = (inDegree.get(neighbor) ?? 0) - 1;
            inDegree.set(neighbor, nextDegree);
            if (nextDegree === 0) {
                queue.push(neighbor);
            }
        }
    }

    if (order.length !== nodeIds.length) {
        throw new ValidationError("Workflow graph contains a cycle");
    }

    return order;
}