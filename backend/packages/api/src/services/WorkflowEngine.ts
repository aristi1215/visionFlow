import { runWorkflow } from "./workflow/WorkflowExecutor.js";

class WorkflowEngine {
    static async executeWorkflow(workflowId: number, videoId: number) {
        return runWorkflow(workflowId, videoId);
    }
}

export default WorkflowEngine;
