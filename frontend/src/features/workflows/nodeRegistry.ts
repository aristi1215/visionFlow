import type { NodeTypes } from '@ondeckai/shared/types/Nodes'

export type NodeCategory = 'ingest' | 'analysis' | 'output' | 'alert'

export type NodeConfigField = {
  label: string
  placeholder: string
  type?: 'text' | 'textarea' | 'select' | 'number'
  options?: string[]
}

export type NodeDefinition = {
  type: NodeTypes
  label: string
  description: string
  category: NodeCategory
  accentClass: string
  configFields: NodeConfigField[]
}

export const NODE_REGISTRY: NodeDefinition[] = [
  {
    type: 'upload_video',
    label: 'Upload video',
    description: 'Upload a video file as the workflow input source.',
    category: 'ingest',
    accentClass: 'border-orange-400',
    configFields: [
      { label: 'Accepted formats', placeholder: 'mp4, mov, avi', type: 'text' },
      { label: 'Max file size (MB)', placeholder: '500', type: 'number' },
    ],
  },
  {
    type: 'extract_frames',
    label: 'Extract frames',
    description: 'Extract frames from the video at a specified interval.',
    category: 'ingest',
    accentClass: 'border-orange-300',
    configFields: [
      { label: 'Frames per second', placeholder: '1', type: 'number' },
      { label: 'Interval (seconds)', placeholder: '5', type: 'number' },
    ],
  },
  {
    type: 'scene_analysis',
    label: 'Scene analysis',
    description: 'Analyze scenes and context within the video.',
    category: 'analysis',
    accentClass: 'border-brown-400',
    configFields: [
      { label: 'Analysis depth', placeholder: 'Standard', type: 'select', options: ['Quick', 'Standard', 'Deep'] },
    ],
  },
  {
    type: 'object_detection',
    label: 'Object detection',
    description: 'Detect objects that appear in the video.',
    category: 'analysis',
    accentClass: 'border-brown-500',
    configFields: [
      { label: 'Object classes', placeholder: 'person, vehicle, package', type: 'text' },
      { label: 'Confidence threshold', placeholder: '0.75', type: 'number' },
    ],
  },
  {
    type: 'timeline_events_generator',
    label: 'Timeline generator',
    description: 'Build a structured timeline of events from the video.',
    category: 'analysis',
    accentClass: 'border-brown-300',
    configFields: [
      { label: 'Event granularity', placeholder: 'Medium', type: 'select', options: ['Fine', 'Medium', 'Coarse'] },
    ],
  },
  {
    type: 'alert_node',
    label: 'Alert node',
    description: 'Send alerts when configured rules detect a problem.',
    category: 'alert',
    accentClass: 'border-red-400',
    configFields: [
      { label: 'Alert rules', placeholder: 'Describe conditions that trigger an alert', type: 'textarea' },
      { label: 'Channel', placeholder: 'slack', type: 'select', options: ['slack', 'gmail'] },
    ],
  },
  {
    type: 'ai_description_node',
    label: 'AI Review',
    description: 'Ask a question to an AI model about the video content.',
    category: 'analysis',
    accentClass: 'border-orange-500',
    configFields: [
      { label: 'Question / prompt', placeholder: 'What safety issues occurred?', type: 'textarea' },
    ],
  },
  {
    type: 'save_results_node',
    label: 'Save results',
    description: 'Output results and send them to a configured channel.',
    category: 'output',
    accentClass: 'border-green-500',
    configFields: [
      { label: 'Output format', placeholder: 'JSON', type: 'select', options: ['JSON', 'CSV', 'PDF'] },
      { label: 'Destination channel', placeholder: 'slack, email, webhook', type: 'text' },
    ],
  },
]

export const NODE_BY_TYPE = Object.fromEntries(
  NODE_REGISTRY.map((node) => [node.type, node]),
) as Record<NodeTypes, NodeDefinition>

export const CATEGORY_LABELS: Record<NodeCategory, string> = {
  ingest: 'Ingest',
  analysis: 'Analysis',
  alert: 'Alerts',
  output: 'Output',
}
