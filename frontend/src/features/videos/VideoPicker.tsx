import { useVideos } from '@/hooks/useVideos'
import type { VideoRow } from '@ondeckai/shared/types/Videos'
import { cn } from '@/lib/cn'
import { Film } from 'lucide-react'

type VideoPickerProps = {
  selectedVideoId: number | null
  onSelect: (video: VideoRow) => void
  className?: string
}

function formatDuration(seconds: number) {
  const mins = Math.floor(seconds / 60)
  const secs = Math.floor(seconds % 60)
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function VideoPicker({
  selectedVideoId,
  onSelect,
  className,
}: VideoPickerProps) {
  const { data: videos = [], isPending, isError } = useVideos()

  if (isPending) {
    return (
      <p className={cn('text-sm text-muted-foreground', className)}>
        Loading videos…
      </p>
    )
  }

  if (isError) {
    return (
      <p className={cn('text-sm text-destructive', className)}>
        Could not load videos.
      </p>
    )
  }

  if (videos.length === 0) {
    return (
      <p className={cn('text-sm text-muted-foreground', className)}>
        No videos yet. Upload one in the tab above.
      </p>
    )
  }

  return (
    <ul className={cn('max-h-64 space-y-2 overflow-y-auto', className)}>
      {videos.map((video) => {
        const selected = selectedVideoId === video.id
        return (
          <li key={video.id}>
            <button
              type="button"
              onClick={() => onSelect(video)}
              className={cn(
                'flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors',
                selected
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:bg-muted/50',
              )}
            >
              <div className="rounded-md bg-muted p-2">
                <Film className="h-4 w-4 text-muted-foreground" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  Video #{video.id}
                </p>
                <p className="text-xs text-muted-foreground">
                  {video.format.toUpperCase()} · {formatDuration(video.duration)}
                  {video.width && video.height
                    ? ` · ${video.width}×${video.height}`
                    : ''}
                </p>
              </div>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
