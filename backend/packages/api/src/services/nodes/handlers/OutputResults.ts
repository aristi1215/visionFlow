

type OutputResults = {
    alertResults?: {
        channel: "slack" | "gmail";
        message: string;
    };
    timelineResults?: {
        events: {
            event_type: string;
        };
    };
    aiAnalysisResults?: {
        analysis: string;
    };
    objectDetectionResults?: {
        detections: {
            object_type: string;
        }[];
    };
    videoAnalysisResults?: {
        analysis: string;
    };
}

class OutputResultsNode {
    static async execute(executionNodeId: string, results: OutputResults, outputFormat: "json" | "csv" | "pdf"){

        /*
            This method represent one of the functionalities of the workflow.
            Is does:
            1. It outputs the results of the complete workflow in a structured format
            2. Returns the results to the client.
            It can be in the format of:
            - JSON
            - CSV
            - PDD
        */

    }
}

export default OutputResultsNode;