import type { Database } from "../database.types.js";

export type AlertRow = Database["public"]["Tables"]["alerts"]["Row"];
export type AlertInsert = Database["public"]["Tables"]["alerts"]["Insert"];
export type AlertUpdate = Database["public"]["Tables"]["alerts"]["Update"];
export type AlertCreate = Omit<AlertRow, "id">;
export type AlertChannel = Database["public"]["Enums"]["alert_channels"];
