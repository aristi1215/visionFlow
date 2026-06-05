const LABEL_TO_KEY: Record<string, string> = {
  'Question / prompt': 'prompt',
  'Alert rules': 'alertRules',
  Channel: 'channel',
  'Accepted formats': 'acceptedFormats',
  'Max file size (MB)': 'maxFileSizeMb',
  'Frames per second': 'framesPerSecond',
  'Interval (seconds)': 'intervalSeconds',
  'Analysis depth': 'analysisDepth',
  'Object classes': 'objectClasses',
  'Confidence threshold': 'confidenceThreshold',
  'Event granularity': 'eventGranularity',
  'Output format': 'outputFormat',
  'Destination channel': 'destinationChannel',
}

export function configKeyForLabel(label: string): string {
  return LABEL_TO_KEY[label] ?? label
}

export function getConfigValue(
  config: Record<string, unknown>,
  label: string,
): string {
  const key = configKeyForLabel(label)
  const value = config[key] ?? config[label]
  if (value == null) return ''
  return String(value)
}

export function setConfigValue(
  config: Record<string, unknown>,
  label: string,
  value: string,
): Record<string, unknown> {
  const key = configKeyForLabel(label)
  return { ...config, [key]: value }
}

export function configsEqual(
  a: Record<string, unknown>,
  b: Record<string, unknown>,
): boolean {
  return JSON.stringify(a) === JSON.stringify(b)
}
