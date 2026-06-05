export type CloudinaryUploadResult = {
  secure_url: string
  format: string
  bytes: number
  width?: number
  height?: number
  duration?: number
}

export type VideoMetadata = {
  duration: number
  fps: number
  width: number | null
  height: number | null
}

function getCloudinaryConfig() {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET

  if (!cloudName || !uploadPreset) {
    throw new Error(
      'Cloudinary is not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET in your .env file.',
    )
  }

  return { cloudName, uploadPreset }
}

export async function uploadToCloudinary(
  file: File,
  onProgress?: (percent: number) => void,
): Promise<CloudinaryUploadResult> {
  const { cloudName, uploadPreset } = getCloudinaryConfig()

  return new Promise((resolve, reject) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', uploadPreset)
    formData.append('resource_type', 'video')

    const xhr = new XMLHttpRequest()
    xhr.open(
      'POST',
      `https://api.cloudinary.com/v1_1/${cloudName}/video/upload`,
    )

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable || !onProgress) return
      onProgress(Math.round((event.loaded / event.total) * 100))
    }

    xhr.onload = () => {
      if (xhr.status < 200 || xhr.status >= 300) {
        reject(new Error('Cloudinary upload failed. Check your upload preset and cloud name.'))
        return
      }

      try {
        const result = JSON.parse(xhr.responseText) as CloudinaryUploadResult
        resolve(result)
      } catch {
        reject(new Error('Invalid response from Cloudinary.'))
      }
    }

    xhr.onerror = () => reject(new Error('Network error during Cloudinary upload.'))
    xhr.send(formData)
  })
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
      const duration = Number.isFinite(video.duration) ? video.duration : 0
      const width = video.videoWidth || null
      const height = video.videoHeight || null
      const fps = duration > 0 ? Math.max(1, Math.round(30)) : 30
      resolve({ duration, fps, width, height })
    }

    video.onerror = () => reject(new Error('Could not read video metadata.'))
  })
}
