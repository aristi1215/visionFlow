import { gemini } from "./gemini.js";

const GEMINI_MODEL = "gemini-3.5-flash";
const VIDEO_CACHE_TTL = "86400s";

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

export async function getOrCreateVideoCache(videoId: number, videoUrl: string): Promise<string> {
    const existingCache = await findVideoCache(videoId);

    if (existingCache?.name) {
        await gemini.caches.update({
            name: existingCache.name,
            config: { ttl: VIDEO_CACHE_TTL },
        });

        return existingCache.name;
    }

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
                                fileUri: videoUrl,
                                mimeType: inferVideoMimeType(videoUrl),
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
