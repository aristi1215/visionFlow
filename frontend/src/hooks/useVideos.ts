import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createVideo,
  deleteVideo,
  fetchVideo,
  fetchVideos,
  videoKeys,
} from '@/lib/api/videos'
import type { VideoCreateBody } from '@ondeckai/shared/types/VideoApi'

export function useVideos() {
  return useQuery({
    queryKey: videoKeys.all,
    queryFn: fetchVideos,
  })
}

export function useVideo(id: number) {
  return useQuery({
    queryKey: videoKeys.detail(id),
    queryFn: () => fetchVideo(id),
    enabled: Number.isFinite(id) && id > 0,
  })
}

export function useCreateVideo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: VideoCreateBody) => createVideo(input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: videoKeys.all })
    },
  })
}

export function useDeleteVideo() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: number) => deleteVideo(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: videoKeys.all })
    },
  })
}
