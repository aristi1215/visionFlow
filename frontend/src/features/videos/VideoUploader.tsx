import { useCallback, useState } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload } from 'lucide-react'
import { Button } from '@/components/ui'
import { useCreateVideo } from '@/hooks/useVideos'
import {
  extractVideoMetadataFromFile,
  uploadToCloudinary,
} from '@/lib/cloudinary/uploadVideo'
import type { VideoRow } from '@ondeckai/shared/types/Videos'
import { cn } from '@/lib/cn'

type VideoUploaderProps = {
  onUploaded: (video: VideoRow) => void
  className?: string
}

export function VideoUploader({ onUploaded, className }: VideoUploaderProps) {
  const createVideo = useCreateVideo()
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFile = useCallback(
    async (file: File) => {
      setError(null)
      setIsUploading(true)
      setProgress(0)

      try {
        const [cloudinaryResult, metadata] = await Promise.all([
          uploadToCloudinary(file, setProgress),
          extractVideoMetadataFromFile(file),
        ])

        const video = await createVideo.mutateAsync({
          duration: cloudinaryResult.duration ?? metadata.duration,
          fps: metadata.fps,
          format: cloudinaryResult.format || file.name.split('.').pop() || 'mp4',
          videoUrl: cloudinaryResult.secure_url,
          width: cloudinaryResult.width ?? metadata.width,
          height: cloudinaryResult.height ?? metadata.height,
          size: cloudinaryResult.bytes ?? file.size,
        })

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
    [createVideo, onUploaded],
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
          'cursor-pointer rounded-lg border border-dashed border-border p-8 text-center transition-colors',
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
          Uploaded to Cloudinary, then registered for workflow runs.
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
