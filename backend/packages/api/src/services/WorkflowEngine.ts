import { supabase } from "../integrations/supabase.js";
import { DatabaseError, NotFoundError, ValidationError } from "../errors/errors.js";
import AIAnalysisNode from "./nodes/handlers/AIAnalysis.js";
import TimelineNode from "./nodes/handlers/Timeline.js";
import AlertNode from "./nodes/handlers/Alerts.js";
import SaveResultsNode from "./nodes/handlers/OutputResults.js";
import ObjectDetectionNode from "./nodes/handlers/ObjectDetection.js";
import UploadVideoNode from "./nodes/handlers/UploadVideo.js";


class WorkflowExecutor {

    static async executeWorkflow(workflowId: string){

        /*
            This method is responsible for executing the complete workflow.
            Aligning all the nodes and executing them in the correct order,
        */

        const nodeRegistry = {
            upload_video: UploadVideoNode,
            object_detection: ObjectDetectionNode,
            timeline_events_generator: TimelineNode,
            ai_description_node: AIAnalysisNode,
            save_results: SaveResultsNode
          }




    }


}