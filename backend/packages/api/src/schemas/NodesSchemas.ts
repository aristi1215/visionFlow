

export const objectDetectionSchema = {
    type: "object",
    properties: {
      detections: {
        type: "array",
        items: {
          type: "object",
          properties: {
            object_type: { type: "string" },
            confidence: { type: "number" }
          },
          required: ["object_type", "confidence"]
        }
      }
    }
  }