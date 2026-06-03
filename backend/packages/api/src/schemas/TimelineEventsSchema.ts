export const timelineEventsSchema = {
    type: "object",
    properties: {
        events: {
            type: "array",
            items: {
                type: "object",
                properties: {
                    event_type: { type: "string" },
                    description: { type: "string" },
                    confidence: { type: "number" },
                },
                required: ["event_type", "description", "confidence"]
            }
        }
    }
}