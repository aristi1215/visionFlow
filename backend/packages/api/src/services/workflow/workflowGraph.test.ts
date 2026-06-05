import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildPredecessorMap, topologicalSort } from "../../utils/helpers.js";
import { createGraph } from "./createGraph.js";
import { resolveUpstreamOutputs } from "./resolveInputs.js";
import type { NodeExecutionResult } from "../../types/WorkflowNodes.js";
import type { NodeTypes } from "@ondeckai/shared/types/Nodes";

describe("workflow graph", () => {
    it("topologicalSort orders linear chain", () => {
        const order = topologicalSort([1, 2, 3], {
            1: [2],
            2: [3],
            3: [],
        });
        assert.deepEqual(order, [1, 2, 3]);
    });

    it("createGraph skips dangling nodes", () => {
        const graph = createGraph(
            [{ id: 1 }, { id: 2 }, { id: 99 }],
            [{ source_node: 1, target_node: 2 }]
        );
        assert.deepEqual(graph.executionOrder, [1, 2]);
        assert.deepEqual(graph.danglingNodes, [99]);
    });

    it("resolveUpstreamOutputs collects predecessor outputs", () => {
        const predecessorMap = buildPredecessorMap([
            { source_node: 1, target_node: 3 },
            { source_node: 2, target_node: 3 },
        ]);
        const store = new Map<number, NodeExecutionResult>([
            [1, { type: "object_detection" as NodeTypes, output: { a: 1 } }],
            [2, { type: "timeline_events_generator" as NodeTypes, output: { b: 2 } }],
        ]);
        const nodesById = new Map([
            [1, { id: 1, type: "object_detection" as NodeTypes }],
            [2, { id: 2, type: "timeline_events_generator" as NodeTypes }],
            [3, { id: 3, type: "save_results_node" as NodeTypes }],
        ]);

        const inputs = resolveUpstreamOutputs(3, predecessorMap, store, nodesById);
        assert.equal(inputs.length, 2);
        assert.ok(inputs.some((i) => i.type === "object_detection"));
        assert.ok(inputs.some((i) => i.type === "timeline_events_generator"));
    });
});
