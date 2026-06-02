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

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const token = tokenGetter ? await tokenGetter() : null

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(init?.headers as Record<string, string> | undefined),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`/api/v1${path}`, {
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

export function unwrapRow<T>(data: T | T[]): T {
  return Array.isArray(data) ? data[0] : data
}

export function unwrapRows<T>(data: T | T[]): T[] {
  return Array.isArray(data) ? data : [data]
}
