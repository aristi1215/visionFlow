import type { VideoRow } from '@ondeckai/shared/types/Videos'
import type { VideoCreateBody } from '@ondeckai/shared/types/VideoApi'
import { apiFetch, unwrapRow } from './client'

type VideosListResponse = { length: number; videos: VideoRow[] }

export async function fetchVideos(): Promise<VideoRow[]> {
  const data = await apiFetch<VideosListResponse>('/videos')
  return data.videos
}

export async function fetchVideo(id: number): Promise<VideoRow> {
  const data = await apiFetch<VideoRow | VideoRow[]>(`/videos/${id}`)
  return unwrapRow(data)
}

export async function createVideo(input: VideoCreateBody): Promise<VideoRow> {
  const data = await apiFetch<VideoRow | VideoRow[]>('/videos', {
    method: 'POST',
    body: JSON.stringify(input),
  })
  return unwrapRow(data)
}

export async function deleteVideo(id: number): Promise<void> {
  await apiFetch(`/videos/${id}`, { method: 'DELETE' })
}

export const videoKeys = {
  all: ['videos'] as const,
  detail: (id: number) => ['videos', id] as const,
}
