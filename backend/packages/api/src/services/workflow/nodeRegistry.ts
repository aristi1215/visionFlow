import type { NodeTypes } from "@ondeckai/shared/types/Nodes";
import type { NodeHandlerClass } from "../../types/WorkflowNodes.js";
import { ValidationError } from "../../errors/errors.js";
import AIAnalysisNode from "../nodes/handlers/AIAnalysis.js";
import TimelineNode from "../nodes/handlers/Timeline.js";
import AlertNode from "../nodes/handlers/Alerts.js";
import SaveResultsNode from "../nodes/handlers/OutputResults.js";
import ObjectDetectionNode from "../nodes/handlers/ObjectDetection.js";

const HANDLERS: NodeHandlerClass[] = [
    ObjectDetectionNode,
    TimelineNode,
    AIAnalysisNode,
    SaveResultsNode,
    AlertNode,
];

export const nodeRegistry: Partial<Record<NodeTypes, NodeHandlerClass>> = Object.fromEntries(
    HANDLERS.map((handler) => [handler.type, handler])
) as Partial<Record<NodeTypes, NodeHandlerClass>>;

export function getNodeHandler(type: NodeTypes): NodeHandlerClass {
    const handler = nodeRegistry[type];
    if (!handler) {
        throw new ValidationError(`No handler registered for node type: ${type}`);
    }
    return handler;
}
