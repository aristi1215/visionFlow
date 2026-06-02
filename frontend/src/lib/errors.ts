import { ApiRequestError } from '@/lib/api/client'

const STATUS_MESSAGES: Record<number, string> = {
  400: 'The request was invalid. Please check your input and try again.',
  401: 'You need to sign in to continue.',
  403: "You don't have permission to perform this action.",
  404: "We couldn't find what you were looking for.",
  409: 'This action conflicts with existing data. Refresh and try again.',
  422: 'Some of the data is invalid. Please review and try again.',
  429: 'Too many requests. Please wait a moment and try again.',
  500: 'Something went wrong on our end. Please try again later.',
  502: 'The server is temporarily unavailable. Please try again.',
  503: 'The service is temporarily unavailable. Please try again.',
}

export function getFriendlyErrorMessage(error: unknown, fallback?: string): string {
  if (error instanceof ApiRequestError) {
    if (error.message && !error.message.startsWith('Request failed')) {
      return error.message
    }
    return STATUS_MESSAGES[error.status] ?? fallback ?? 'Something went wrong. Please try again.'
  }

  if (error instanceof Error && error.message) {
    if (error.message === 'Failed to fetch' || error.message.includes('NetworkError')) {
      return 'Unable to reach the server. Check your connection and try again.'
    }
    return error.message
  }

  return fallback ?? 'Something went wrong. Please try again.'
}
