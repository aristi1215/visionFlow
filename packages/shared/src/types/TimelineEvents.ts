import type { Database } from "../database.types.js";

export type TimelineEventRow = Database["public"]["Tables"]["timeline_events"]["Row"];
export type TimelineEventInsert = Database["public"]["Tables"]["timeline_events"]["Insert"];
export type TimelineEventUpdate = Database["public"]["Tables"]["timeline_events"]["Update"];
export type TimelineEventCreate = Omit<TimelineEventRow, "id">;
