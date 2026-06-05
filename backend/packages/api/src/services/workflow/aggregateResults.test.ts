import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { aggregateUpstreamResults } from "./aggregateResults.js";
import type { NodeTypes } from "@ondeckai/shared/types/Nodes";

describe("aggregateUpstreamResults", () => {
    it("maps upstream outputs by node type", () => {
        const results = aggregateUpstreamResults([
            {
                nodeId: 1,
                type: "object_detection" as NodeTypes,
                output: { output_json: '{"detections":[]}' },
            },
            {
                nodeId: 2,
                type: "ai_description_node" as NodeTypes,
                output: { output_response: "summary" },
            },
        ]);

        assert.deepEqual(results.objectDetectionResults, { detections: [] });
        assert.deepEqual(results.aiAnalysisResults, { analysis: "summary" });
    });
});
