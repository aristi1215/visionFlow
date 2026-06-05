import { FileState } from "@google/genai";
import { gemini } from "./gemini.js";
import { resolveVideoSourceUrl } from "./supabaseStorage.js";

const GEMINI_MODEL = process.env.GEMINI_MODEL ?? "gemini-3.5-flash";
const VIDEO_CACHE_TTL = "86400s";
const FILE_ACTIVE_TIMEOUT_MS = 120_000;
const FILE_POLL_INTERVAL_MS = 2_000;

/** Context caching is not available on the Gemini API free tier (quota limit = 0). */
function useVideoCache(): boolean {
    return process.env.GEMINI_USE_VIDEO_CACHE === "true";
}

export function videoCacheDisplayName(videoId: number): string {
    return `video-${videoId}`;
}

function inferVideoMimeType(videoUrl: string): string {
    const ext = videoUrl.split(/[?#]/)[0]?.split(".").pop()?.toLowerCase();
    const mimeByExt: Record<string, string> = {
        mp4: "video/mp4",
        webm: "video/webm",
        mov: "video/quicktime",
        avi: "video/x-msvideo",
    };

    return mimeByExt[ext ?? ""] ?? "video/mp4";
}

async function findVideoCache(videoId: number) {
    const prefix = videoCacheDisplayName(videoId);
    const pager = await gemini.caches.list({ config: { pageSize: 100 } });
    let page = pager.page;

    while (true) {
        for (const cache of page) {
            if (cache.displayName?.startsWith(prefix)) {
                return cache;
            }
        }

        if (!pager.hasNextPage()) break;
        page = await pager.nextPage();
    }

    return null;
}

async function findGeminiVideoFile(videoId: number) {
    const displayName = videoCacheDisplayName(videoId);
    const pager = await gemini.files.list({ config: { pageSize: 100 } });
    let page = pager.page;

    while (true) {
        for (const file of page) {
            if (file.displayName === displayName && file.uri) {
                return file;
            }
        }

        if (!pager.hasNextPage()) break;
        page = await pager.nextPage();
    }

    return null;
}

async function waitForActiveFileUri(fileName: string): Promise<string> {
    const deadline = Date.now() + FILE_ACTIVE_TIMEOUT_MS;

    while (Date.now() < deadline) {
        const file = await gemini.files.get({ name: fileName });

        if (file.state === FileState.ACTIVE && file.uri) {
            return file.uri;
        }

        if (file.state === FileState.FAILED) {
            throw new Error(
                `Gemini file processing failed: ${file.error?.message ?? "unknown error"}`,
            );
        }

        await new Promise((resolve) => setTimeout(resolve, FILE_POLL_INTERVAL_MS));
    }

    throw new Error(`Timed out waiting for Gemini file ${fileName} to become active`);
}

/**
 * Gemini API (API-key / AI Studio mode) does not accept arbitrary public HTTPS URLs in
 * fileData.fileUri — even when the URL is publicly accessible (e.g. Supabase Storage).
 * The file must be uploaded via the Gemini Files API first; only the returned URI works.
 */
async function getOrUploadGeminiFileUri(videoId: number, storedVideoUrl: string): Promise<string> {
    const existingFile = await findGeminiVideoFile(videoId);
    if (existingFile?.uri && existingFile.state === FileState.ACTIVE) {
        return existingFile.uri;
    }

    const sourceUrl = resolveVideoSourceUrl(storedVideoUrl);
    const response = await fetch(sourceUrl);
    if (!response.ok) {
        throw new Error(`Failed to fetch video from ${sourceUrl}: ${response.status}`);
    }

    const buffer = Buffer.from(await response.arrayBuffer());
    const mimeType = inferVideoMimeType(storedVideoUrl);

    const uploadedFile = await gemini.files.upload({
        file: new Blob([buffer], { type: mimeType }),
        config: {
            displayName: videoCacheDisplayName(videoId),
            mimeType,
        },
    });

    if (!uploadedFile.name) {
        throw new Error(`Failed to upload video ${videoId} to Gemini`);
    }

    return waitForActiveFileUri(uploadedFile.name);
}

async function createVideoCache(videoId: number, storedVideoUrl: string): Promise<string> {
    const existingCache = await findVideoCache(videoId);

    if (existingCache?.name) {
        await gemini.caches.update({
            name: existingCache.name,
            config: { ttl: VIDEO_CACHE_TTL },
        });

        return existingCache.name;
    }

    const fileUri = await getOrUploadGeminiFileUri(videoId, storedVideoUrl);

    const cache = await gemini.caches.create({
        model: GEMINI_MODEL,
        config: {
            displayName: videoCacheDisplayName(videoId),
            contents: [
                {
                    role: "user",
                    parts: [
                        {
                            fileData: {
                                fileUri,
                                mimeType: inferVideoMimeType(storedVideoUrl),
                            },
                        },
                    ],
                },
            ],
            ttl: VIDEO_CACHE_TTL,
        },
    });

    if (!cache.name) {
        throw new Error(`Failed to create Gemini cache for video ${videoId}`);
    }

    return cache.name;
}

type VideoGenerateConfig = Record<string, unknown>;

/**
 * Runs generateContent with the video attached. Uses context caching when
 * GEMINI_USE_VIDEO_CACHE=true (paid tier); otherwise uploads the file once and
 * attaches it directly to each request (free tier compatible).
 */
export async function generateContentWithVideo(
    videoId: number,
    storedVideoUrl: string,
    prompt: string,
    config: VideoGenerateConfig = {},
) {
    const mimeType = inferVideoMimeType(storedVideoUrl);

    if (useVideoCache()) {
        const cachedContent = await createVideoCache(videoId, storedVideoUrl);

        return gemini.models.generateContent({
            model: GEMINI_MODEL,
            contents: prompt,
            config: {
                ...config,
                cachedContent,
            },
        });
    }

    const fileUri = await getOrUploadGeminiFileUri(videoId, storedVideoUrl);

    return gemini.models.generateContent({
        model: GEMINI_MODEL,
        contents: [
            {
                role: "user",
                parts: [
                    { fileData: { fileUri, mimeType } },
                    { text: prompt },
                ],
            },
        ],
        config,
    });
}
