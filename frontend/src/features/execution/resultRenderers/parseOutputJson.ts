export function parseOutputJson(value: unknown): unknown {
  if (typeof value !== 'string') return value
  try {
    return JSON.parse(value)
  } catch {
    return value
  }
}

export function formatOutputForDisplay(output: unknown): string {
  if (output == null) return ''
  if (typeof output === 'string') return output
  return JSON.stringify(output, null, 2)
}
