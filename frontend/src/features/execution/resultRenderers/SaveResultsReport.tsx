import { Badge } from '@/components/ui'
import {
  normalizeDetections,
  normalizeTimelineEvents,
} from './parseOutputJson'

type SaveResultsReportProps = {
  output: Record<string, unknown>
}

const SECTION_LABELS: Record<string, string> = {
  video: 'Video',
  objectDetectionResults: 'Object detection',
  timelineResults: 'Timeline',
  aiAnalysisResults: 'AI analysis',
  alertResults: 'Alert',
  videoAnalysisResults: 'Video analysis',
}

function extractReportData(output: Record<string, unknown>): unknown {
  if ('results' in output && output.results != null) {
    return output.results
  }

  if ('output_report' in output && output.output_report != null) {
    const report = output.output_report
    if (typeof report === 'object') return report
    if (typeof report === 'string') {
      const trimmed = report.trim()
      if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        try {
          return JSON.parse(trimmed)
        } catch {
          return trimmed
        }
      }
      return trimmed
    }
  }

  return null
}

function ObjectDetectionSection({ data }: { data: unknown }) {
  const items = normalizeDetections(data)
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No detections reported.</p>
  }

  return (
    <ul className="space-y-2">
      {items.map((item, index) => (
        <li
          key={index}
          className="rounded-md border border-border/50 bg-muted/20 px-3 py-2 text-sm text-foreground"
        >
          {typeof item === 'object' && item !== null
            ? Object.entries(item as Record<string, unknown>)
                .map(([key, value]) => `${key}: ${String(value)}`)
                .join(' · ')
            : String(item)}
        </li>
      ))}
    </ul>
  )
}

function TimelineSection({ data }: { data: unknown }) {
  const items = normalizeTimelineEvents(data)
  if (items.length === 0) {
    return <p className="text-sm text-muted-foreground">No timeline events reported.</p>
  }

  return (
    <ol className="space-y-2 border-l-2 border-primary/30 pl-4">
      {items.map((item, index) => (
        <li key={index} className="text-sm text-foreground">
          {typeof item === 'object' && item !== null ? (
            <div className="space-y-0.5">
              <div className="flex flex-wrap items-center gap-2">
                {'timestamp' in item && (
                  <span className="font-medium">{String(item.timestamp as string)}</span>
                )}
                {'event_type' in item && (
                  <Badge variant="muted">{String(item.event_type)}</Badge>
                )}
              </div>
              <span className="text-muted-foreground">
                {'description' in item
                  ? String(item.description)
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

function VideoSection({ data }: { data: unknown }) {
  if (!data || typeof data !== 'object') return null
  const video = data as Record<string, unknown>

  return (
    <dl className="grid gap-1 text-sm">
      {'videoUrl' in video && (
        <>
          <dt className="text-muted-foreground">URL</dt>
          <dd className="break-all text-foreground">{String(video.videoUrl)}</dd>
        </>
      )}
      {'duration' in video && video.duration != null && (
        <>
          <dt className="text-muted-foreground">Duration</dt>
          <dd className="text-foreground">{String(video.duration)}</dd>
        </>
      )}
    </dl>
  )
}

function AnalysisSection({ data }: { data: unknown }) {
  const text =
    typeof data === 'object' && data !== null && 'analysis' in data
      ? String((data as Record<string, unknown>).analysis)
      : typeof data === 'string'
        ? data
        : ''

  if (!text) {
    return <p className="text-sm text-muted-foreground">No analysis reported.</p>
  }

  return <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{text}</p>
}

function AlertSection({ data }: { data: unknown }) {
  if (!data || typeof data !== 'object') return null
  const alert = data as Record<string, unknown>

  return (
    <div className="space-y-2">
      {'channel' in alert && <Badge variant="muted">{String(alert.channel)}</Badge>}
      {'message' in alert && (
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
          {String(alert.message)}
        </p>
      )}
    </div>
  )
}

function GenericSection({ data }: { data: unknown }) {
  if (data == null) return null

  if (typeof data === 'string') {
    return (
      <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">{data}</p>
    )
  }

  if (Array.isArray(data)) {
    return (
      <ul className="list-disc space-y-1 pl-5 text-sm text-foreground">
        {data.map((item, index) => (
          <li key={index}>{typeof item === 'string' ? item : JSON.stringify(item)}</li>
        ))}
      </ul>
    )
  }

  if (typeof data === 'object') {
    return (
      <dl className="space-y-2 text-sm">
        {Object.entries(data as Record<string, unknown>).map(([key, value]) => (
          <div key={key}>
            <dt className="font-medium text-foreground">{key}</dt>
            <dd className="mt-0.5 whitespace-pre-wrap text-muted-foreground">
              {typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
            </dd>
          </div>
        ))}
      </dl>
    )
  }

  return <p className="text-sm text-foreground">{String(data)}</p>
}

function renderSection(key: string, data: unknown) {
  switch (key) {
    case 'video':
      return <VideoSection data={data} />
    case 'objectDetectionResults':
      return <ObjectDetectionSection data={data} />
    case 'timelineResults':
      return <TimelineSection data={data} />
    case 'aiAnalysisResults':
    case 'videoAnalysisResults':
      return <AnalysisSection data={data} />
    case 'alertResults':
      return <AlertSection data={data} />
    default:
      return <GenericSection data={data} />
  }
}

function StructuredReport({ data }: { data: Record<string, unknown> }) {
  const entries = Object.entries(data).filter(([, value]) => value != null)

  if (entries.length === 0) {
    return <p className="text-sm text-muted-foreground">No results to display.</p>
  }

  return (
    <div className="space-y-5 pr-1">
      {entries.map(([key, value]) => (
        <section key={key} className="space-y-2">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            {SECTION_LABELS[key] ?? key.replace(/([A-Z])/g, ' $1').trim()}
          </h4>
          {renderSection(key, value)}
        </section>
      ))}
    </div>
  )
}

function TextReport({ text }: { text: string }) {
  const blocks = text.split(/\n{2,}/)

  return (
    <div className="space-y-4 pr-1">
      {blocks.map((block, index) => {
        const trimmed = block.trim()
        if (!trimmed) return null

        if (trimmed.startsWith('# ')) {
          return (
            <h3 key={index} className="text-base font-semibold text-foreground">
              {trimmed.slice(2)}
            </h3>
          )
        }

        if (trimmed.startsWith('## ')) {
          return (
            <h4 key={index} className="text-sm font-semibold text-foreground">
              {trimmed.slice(3)}
            </h4>
          )
        }

        if (trimmed.startsWith('### ')) {
          return (
            <h5 key={index} className="text-sm font-medium text-foreground">
              {trimmed.slice(4)}
            </h5>
          )
        }

        const lines = trimmed.split('\n')
        const isList = lines.every((line) => /^[-*]\s/.test(line.trim()))

        if (isList) {
          return (
            <ul key={index} className="list-disc space-y-1 pl-5 text-sm leading-relaxed text-foreground">
              {lines.map((line, lineIndex) => (
                <li key={lineIndex}>{line.replace(/^[-*]\s+/, '')}</li>
              ))}
            </ul>
          )
        }

        return (
          <p key={index} className="whitespace-pre-wrap text-sm leading-relaxed text-foreground">
            {trimmed}
          </p>
        )
      })}
    </div>
  )
}

export function SaveResultsReport({ output }: SaveResultsReportProps) {
  const data = extractReportData(output)

  if (data == null || data === '') {
    return <p className="text-sm text-muted-foreground">No report available.</p>
  }

  if (typeof data === 'object' && !Array.isArray(data)) {
    return <StructuredReport data={data as Record<string, unknown>} />
  }

  return <TextReport text={String(data)} />
}
