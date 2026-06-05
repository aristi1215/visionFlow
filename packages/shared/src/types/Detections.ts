import type { Database } from "../database.types.js";

export type DetectionRow = Database["public"]["Tables"]["detections"]["Row"];
export type DetectionInsert = Database["public"]["Tables"]["detections"]["Insert"];
export type DetectionUpdate = Database["public"]["Tables"]["detections"]["Update"];
export type DetectionCreate = Omit<DetectionRow, "id">;
