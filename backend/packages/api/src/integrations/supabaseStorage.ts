import {
    CreateBucketCommand,
    DeleteObjectCommand,
    HeadBucketCommand,
    PutObjectCommand,
    S3Client,
} from "@aws-sdk/client-s3";
import { randomUUID } from "node:crypto";
import path from "node:path";

export const VIDEOS_BUCKET = "videos";

function getProjectRef(): string {
    const supabaseUrl = process.env.SUPABASE_URL;
    if (!supabaseUrl) {
        throw new Error("SUPABASE_URL is not configured");
    }

    const hostname = new URL(supabaseUrl).hostname;
    const projectRef = hostname.split(".")[0];
    if (!projectRef) {
        throw new Error("Could not parse Supabase project ref from SUPABASE_URL");
    }

    return projectRef;
}

function getS3Client(): S3Client {
    const accessKeyId = process.env.SUPABASE_S3_ACCESS_KEY;
    const secretAccessKey = process.env.SUPABASE_S3_SECRET_KEY;

    if (!accessKeyId || !secretAccessKey) {
        throw new Error("SUPABASE_S3_ACCESS_KEY and SUPABASE_S3_SECRET_KEY are required");
    }

    const projectRef = getProjectRef();

    return new S3Client({
        forcePathStyle: true,
        region: "auto",
        endpoint: `https://${projectRef}.storage.supabase.co/storage/v1/s3`,
        credentials: { accessKeyId, secretAccessKey },
    });
}

let bucketReady = false;

export async function ensureVideosBucket(): Promise<void> {
    if (bucketReady) return;

    const client = getS3Client();

    try {
        await client.send(new HeadBucketCommand({ Bucket: VIDEOS_BUCKET }));
    } catch {
        await client.send(new CreateBucketCommand({ Bucket: VIDEOS_BUCKET }));
    }

    bucketReady = true;
}

export function buildPublicStorageUrl(objectKey: string): string {
    const projectRef = getProjectRef();
    return `https://${projectRef}.supabase.co/storage/v1/object/public/${VIDEOS_BUCKET}/${objectKey}`;
}

export function resolveVideoSourceUrl(videoUrl: string): string {
    if (videoUrl.startsWith("http://") || videoUrl.startsWith("https://")) {
        return videoUrl;
    }

    return buildPublicStorageUrl(videoUrl);
}

export function buildObjectKey(userId: string, originalName: string): string {
    const ext = path.extname(originalName).replace(/^\./, "").toLowerCase() || "mp4";
    return `${userId}/${randomUUID()}.${ext}`;
}

export async function uploadVideoObject(
    objectKey: string,
    body: Buffer,
    contentType: string,
): Promise<string> {
    await ensureVideosBucket();

    const client = getS3Client();

    await client.send(
        new PutObjectCommand({
            Bucket: VIDEOS_BUCKET,
            Key: objectKey,
            Body: body,
            ContentType: contentType,
        }),
    );

    return objectKey;
}

export async function deleteVideoObject(videoUrl: string): Promise<void> {
    if (videoUrl.startsWith("http://") || videoUrl.startsWith("https://")) {
        const marker = `/object/public/${VIDEOS_BUCKET}/`;
        const index = videoUrl.indexOf(marker);
        if (index === -1) return;
        videoUrl = videoUrl.slice(index + marker.length);
    }

    await ensureVideosBucket();

    const client = getS3Client();
    await client.send(
        new DeleteObjectCommand({
            Bucket: VIDEOS_BUCKET,
            Key: videoUrl,
        }),
    );
}
