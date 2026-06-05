export function parseOutputJson(value: unknown): unknown {
  if (typeof value !== 'string') return value
  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}

function extractArrayField(data: unknown, field: string): unknown[] {
  const parsed = parseOutputJson(data)
  if (Array.isArray(parsed)) return parsed
  if (parsed && typeof parsed === 'object' && field in parsed) {
    const items = (parsed as Record<string, unknown>)[field]
    return Array.isArray(items) ? items : []
  }
  return []
}

export function normalizeTimelineEvents(data: unknown): unknown[] {
  return extractArrayField(data, 'events')
}

export function normalizeDetections(data: unknown): unknown[] {
  return extractArrayField(data, 'detections')
}

export function formatOutputForDisplay(output: unknown): string {
  if (output == null) return ''
  if (typeof output === 'string') return output
  return JSON.stringify(output, null, 2)
}
