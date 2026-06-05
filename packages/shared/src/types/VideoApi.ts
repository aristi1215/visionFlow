export type VideoCreateBody = {
    duration: number;
    fps: number;
    format: string;
    videoUrl: string;
    width?: number | null;
    height?: number | null;
    size?: number | null;
};
