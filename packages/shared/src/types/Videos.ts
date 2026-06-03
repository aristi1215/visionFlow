import type { Database } from "../database.types.js";

export type VideoRow = Database["public"]["Tables"]["videos"]["Row"];
export type VideoInsert = Database["public"]["Tables"]["videos"]["Insert"];
export type VideoUpdate = Database["public"]["Tables"]["videos"]["Update"];
export type VideoCreate = Omit<VideoRow, "id">;

export type VideoUploadInput = Omit<VideoInsert, "user_id" | "video_url"> & {
    userId: string;
    videoUrl: string;
};
