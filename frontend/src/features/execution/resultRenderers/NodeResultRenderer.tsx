import type { NodeTypes } from '@ondeckai/shared/types/Nodes'
import { Badge } from '@/components/ui'
import { NODE_BY_TYPE } from '@/features/workflows/nodeRegistry'
import { formatOutputForDisplay, parseOutputJson } from './parseOutputJson'

type NodeResultRendererProps = {
  nodeType: NodeTypes
  output: unknown
  showRaw?: boolean
}

function DetectionList({ data }: { data: unknown }) {
  const items = Array.isArray(data) ? data : []
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No detections returned.</p>
  }

  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li
          key={index}
          className="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm"
        >
          {typeof item === 'object' && item !== null
            ? Object.entries(item as Record<string, unknown>)
                .map(([k, v]) => `${k}: ${String(v)}`)
                .join(' · ')
            : String(item)}
        </li>
      ))}
    </ul>
  )
}

function TimelineList({ data }: { data: unknown }) {
  const items = Array.isArray(data) ? data : []
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No timeline events returned.</p>
  }

  return (
    <ol className="space-y-2 border-l-2 border-primary/30 pl-4">
      {items.map((item, index) => (
        <li key={index} className="text-sm">
          {typeof item === 'object' && item !== null ? (
            <div>
              {'timestamp' in (item as object) && (
                <span className="font-medium text-foreground">
                  {String((item as Record<string, unknown>).timestamp)}{' '}
                </span>
              )}
              <span className="text-muted-foreground">
                {'description' in (item as object)
                  ? String((item as Record<string, unknown>).description)
                  : JSON.stringify(item)}
              </span>
            </div>
          ) : (
            String(item)
          )}
        </li>
      ))}
    </ol>
  )
}

export function NodeResultRenderer({
  nodeType,
  output,
  showRaw = false,
}: NodeResultRendererProps) {
  if (showRaw) {
    return (
      <pre className="max-h-64 overflow-auto rounded-md bg-muted/50 p-3 text-xs">
        {formatOutputForDisplay(output)}
      </pre>
    )
  }

  if (nodeType === 'upload_video') {
    return (
      <p className="text-sm text-muted-foreground">
        Video input is provided externally and this node is skipped during execution.
      </p>
    )
  }

  const record =
    output && typeof output === 'object' ? (output as Record<string, unknown>) : {}

  if (nodeType === 'object_detection' && 'output_json' in record) {
    return <DetectionList data={parseOutputJson(record.output_json)} />
  }

  if (nodeType === 'timeline_events_generator' && 'output_json' in record) {
    return <TimelineList data={parseOutputJson(record.output_json)} />
  }

  if (nodeType === 'ai_description_node' && 'output_response' in record) {
    return (
      <p className="whitespace-pre-wrap text-sm text-foreground">
        {String(record.output_response)}
      </p>
    )
  }

  if (nodeType === 'alert_node') {
    return (
      <div className="space-y-2 text-sm">
        {'channel' in record && (
          <Badge variant="brown">{String(record.channel)}</Badge>
        )}
        {'messageSent' in record && (
          <p className="whitespace-pre-wrap text-foreground">
            {String(record.messageSent)}
          </p>
        )}
      </div>
    )
  }

  if (nodeType === 'save_results_node' && 'output_report' in record) {
    return (
      <pre className="max-h-96 overflow-auto whitespace-pre-wrap rounded-md bg-muted/30 p-3 text-sm">
        {String(record.output_report)}
      </pre>
    )
  }

  const label = NODE_BY_TYPE[nodeType]?.label ?? nodeType
  return (
    <div className="space-y-1">
      <p className="text-xs text-muted-foreground">{label} output</p>
      <pre className="max-h-48 overflow-auto rounded-md bg-muted/50 p-3 text-xs">
        {formatOutputForDisplay(output)}
      </pre>
    </div>
  )
}
