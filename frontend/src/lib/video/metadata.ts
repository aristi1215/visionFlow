export type VideoMetadata = {
  duration: number
  fps: number
  width: number | null
  height: number | null
}

export async function extractVideoMetadataFromFile(
  file: File,
): Promise<VideoMetadata> {
  const objectUrl = URL.createObjectURL(file)

  try {
    return await extractVideoMetadataFromUrl(objectUrl)
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

export async function extractVideoMetadataFromUrl(
  url: string,
): Promise<VideoMetadata> {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.preload = 'metadata'
    video.src = url

    video.onloadedmetadata = () => {
      const duration = Number.isFinite(video.duration)
        ? Math.round(video.duration)
        : 0
      const width = video.videoWidth || null
      const height = video.videoHeight || null
      const fps = duration > 0 ? Math.max(1, Math.round(30)) : 30
      resolve({ duration, fps, width, height })
    }

    video.onerror = () => reject(new Error('Could not read video metadata.'))
  })
}
