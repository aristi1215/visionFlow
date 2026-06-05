type ApiSuccess<T> = { status: 'success'; data: T }

type ApiError = { status: 'error'; message: string }

export class ApiRequestError extends Error {
  status: number

  constructor(message: string, status: number) {
    super(message)
    this.name = 'ApiRequestError'
    this.status = status
  }
}

let tokenGetter: (() => Promise<string | null>) | null = null

export function setApiTokenGetter(getter: () => Promise<string | null>) {
  tokenGetter = getter
}

function getApiRoot(): string {
  if (import.meta.env.DEV) {
    return '/api/v1'
  }

  const baseUrl = import.meta.env.VITE_API_URL
  if (!baseUrl) {
    throw new Error('VITE_API_URL is not configured')
  }

  return `${baseUrl}/api/v1`
}

async function buildAuthHeaders(
  init?: RequestInit,
): Promise<Record<string, string>> {
  const token = tokenGetter ? await tokenGetter() : null

  const headers: Record<string, string> = {
    ...(init?.headers as Record<string, string> | undefined),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  return headers
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const headers = await buildAuthHeaders(init)

  if (!headers['Content-Type'] && !(init?.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(`${getApiRoot()}${path}`, {
    ...init,
    headers,
  })

  const body = (await response.json()) as ApiSuccess<T> | ApiError

  if (!response.ok || body.status === 'error') {
    const message =
      body.status === 'error' ? body.message : `Request failed (${response.status})`

    throw new ApiRequestError(message, response.status)
  }

  return body.data
}

export async function apiUpload<T>(
  path: string,
  formData: FormData,
  onProgress?: (percent: number) => void,
): Promise<T> {
  const token = tokenGetter ? await tokenGetter() : null

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', `${getApiRoot()}${path}`)

    if (token) {
      xhr.setRequestHeader('Authorization', `Bearer ${token}`)
    }

    xhr.upload.onprogress = (event) => {
      if (!event.lengthComputable || !onProgress) return
      onProgress(Math.round((event.loaded / event.total) * 100))
    }

    xhr.onload = () => {
      if (xhr.status < 200 || xhr.status >= 300) {
        try {
          const errorBody = JSON.parse(xhr.responseText) as ApiError
          reject(new ApiRequestError(errorBody.message ?? 'Upload failed', xhr.status))
        } catch {
          reject(new ApiRequestError('Upload failed', xhr.status))
        }
        return
      }

      try {
        const body = JSON.parse(xhr.responseText) as ApiSuccess<T> | ApiError
        if (body.status === 'error') {
          reject(new ApiRequestError(body.message ?? 'Upload failed', xhr.status))
          return
        }
        resolve(body.data)
      } catch {
        reject(new ApiRequestError('Invalid upload response', xhr.status))
      }
    }

    xhr.onerror = () => reject(new ApiRequestError('Network error during upload', 0))
    xhr.send(formData)
  })
}

export function unwrapRow<T>(data: T | T[]): T {
  return Array.isArray(data) ? data[0] : data
}

export function unwrapRows<T>(data: T | T[]): T[] {
  return Array.isArray(data) ? data : [data]
}
