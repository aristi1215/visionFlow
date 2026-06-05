import type { VideoWithDelivery } from '@ondeckai/shared/types/VideoApi'
import { apiFetch, apiUpload } from './client'

type VideosListResponse = { length: number; videos: VideoWithDelivery[] }

export type VideoMetadata = {
  duration: number
  fps: number
  width: number | null
  height: number | null
}

export async function fetchVideos(): Promise<VideoWithDelivery[]> {
  const data = await apiFetch<VideosListResponse>('/videos')
  return data.videos
}

export async function fetchVideo(id: number): Promise<VideoWithDelivery> {
  return apiFetch<VideoWithDelivery>(`/videos/${id}`)
}

export async function uploadVideo(
  file: File,
  metadata: VideoMetadata,
  onProgress?: (percent: number) => void,
): Promise<VideoWithDelivery> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('duration', String(metadata.duration))
  formData.append('fps', String(metadata.fps))
  formData.append('format', file.name.split('.').pop() || 'mp4')

  if (metadata.width != null) {
    formData.append('width', String(metadata.width))
  }

  if (metadata.height != null) {
    formData.append('height', String(metadata.height))
  }

  return apiUpload<VideoWithDelivery>('/videos/upload', formData, onProgress)
}

export async function deleteVideo(id: number): Promise<void> {
  await apiFetch(`/videos/${id}`, { method: 'DELETE' })
}

export const videoKeys = {
  all: ['videos'] as const,
  detail: (id: number) => ['videos', id] as const,
}
