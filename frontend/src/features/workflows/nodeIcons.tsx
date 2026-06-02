import {
  Bell,
  Box,
  Clock,
  Film,
  Save,
  ScanEye,
  Sparkles,
  Upload,
  type LucideIcon,
} from 'lucide-react'
import type { NodeTypes } from '@ondeckai/shared/types/Nodes'

export const NODE_ICONS: Record<NodeTypes, LucideIcon> = {
  upload_video: Upload,
  extract_frames: Film,
  scene_analysis: ScanEye,
  object_detection: Box,
  timeline_events_generator: Clock,
  alert_node: Bell,
  ai_description_node: Sparkles,
  save_results_node: Save,
}

export function NodeIcon({
  type,
  className,
}: {
  type: NodeTypes
  className?: string
}) {
  const Icon = NODE_ICONS[type]
  return <Icon className={className} />
}
