import { useCallback, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { useDropzone } from 'react-dropzone'
import { Upload } from 'lucide-react'
import { Button } from '@/components/ui'
import { uploadVideo, videoKeys } from '@/lib/api/videos'
import { extractVideoMetadataFromFile } from '@/lib/video/metadata'
import type { VideoWithDelivery } from '@ondeckai/shared/types/VideoApi'
import { cn } from '@/lib/cn'

type VideoUploaderProps = {
  onUploaded: (video: VideoWithDelivery) => void
  className?: string
}

export function VideoUploader({ onUploaded, className }: VideoUploaderProps) {
  const queryClient = useQueryClient()
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFile = useCallback(
    async (file: File) => {
      setError(null)
      setIsUploading(true)
      setProgress(0)

      try {
        const metadata = await extractVideoMetadataFromFile(file)
        const video = await uploadVideo(file, metadata, setProgress)
        await queryClient.invalidateQueries({ queryKey: videoKeys.all })

        onUploaded(video)
      } catch (uploadError) {
        setError(
          uploadError instanceof Error
            ? uploadError.message
            : 'Upload failed. Please try again.',
        )
      } finally {
        setIsUploading(false)
      }
    },
    [onUploaded, queryClient],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { 'video/*': ['.mp4', '.mov', '.avi', '.webm', '.mkv'] },
    maxFiles: 1,
    disabled: isUploading,
    onDrop: (accepted) => {
      const file = accepted[0]
      if (file) void handleFile(file)
    },
  })

  return (
    <div className={cn('space-y-3', className)}>
      <div
        {...getRootProps()}
        className={cn(
          'cursor-pointer rounded-lg border border-dashed border-border/60 p-8 text-center transition-all duration-200',
          isDragActive && 'border-primary bg-primary/5',
          isUploading && 'pointer-events-none opacity-70',
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto mb-2 h-8 w-8 text-muted-foreground" />
        <p className="text-sm font-medium text-foreground">
          {isDragActive ? 'Drop video here' : 'Drag & drop a video, or click to browse'}
        </p>
        <p className="mt-1 text-xs text-muted-foreground">
          Stored in Supabase. Cloudinary optimization will be added later.
        </p>
      </div>

      {isUploading && (
        <div className="space-y-1">
          <div className="h-2 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full bg-primary transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
          <p className="text-xs text-muted-foreground">Uploading… {progress}%</p>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {isUploading && (
        <Button disabled className="w-full">
          Uploading…
        </Button>
      )}
    </div>
  )
}
