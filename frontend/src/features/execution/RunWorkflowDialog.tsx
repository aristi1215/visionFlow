import { useMemo, useState } from 'react'
import type { Edge, Node } from '@xyflow/react'
import { Loader2, Play, X } from 'lucide-react'
import { Alert, Button } from '@/components/ui'
import { VideoPicker } from '@/features/videos/VideoPicker'
import { VideoUploader } from '@/features/videos/VideoUploader'
import type { VideoRow } from '@ondeckai/shared/types/Videos'
import type { WorkflowBaseline } from '@/features/editor/workflowCanvasUtils'
import { validateWorkflowForRun } from './validateWorkflowForRun'
import { cn } from '@/lib/cn'

type RunWorkflowDialogProps = {
  open: boolean
  onClose: () => void
  baseline: WorkflowBaseline | null
  nodes: Node[]
  edges: Edge[]
  isDirty: boolean
  isSaving: boolean
  isRunning: boolean
  onSave: () => Promise<void>
  onRun: (videoId: number) => Promise<void>
}

type Tab = 'upload' | 'library'

export function RunWorkflowDialog({
  open,
  onClose,
  baseline,
  nodes,
  edges,
  isDirty,
  isSaving,
  isRunning,
  onSave,
  onRun,
}: RunWorkflowDialogProps) {
  const [tab, setTab] = useState<Tab>('upload')
  const [selectedVideo, setSelectedVideo] = useState<VideoRow | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  const validation = useMemo(
    () =>
      validateWorkflowForRun(
        baseline,
        nodes,
        edges,
        isDirty,
        selectedVideo?.id ?? null,
      ),
    [baseline, nodes, edges, isDirty, selectedVideo],
  )

  if (!open) return null

  const handleRun = async () => {
    setActionError(null)
    if (!selectedVideo) return

    try {
      if (isDirty) {
        await onSave()
      }
      await onRun(selectedVideo.id)
      onClose()
    } catch (error) {
      setActionError(
        error instanceof Error ? error.message : 'Workflow run failed.',
      )
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="run-workflow-title"
        className="flex max-h-[90vh] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-border bg-card shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div>
            <h2 id="run-workflow-title" className="font-display text-lg text-foreground">
              Run workflow
            </h2>
            <p className="text-sm text-muted-foreground">
              {nodes.length} nodes · {edges.length} connections
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} disabled={isRunning}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 py-4">
          {validation.errors.length > 0 && (
            <Alert variant="error" title="Cannot run yet" className="mb-4">
              <ul className="list-inside list-disc text-sm">
                {validation.errors.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            </Alert>
          )}

          {validation.warnings.length > 0 && (
            <Alert variant="warning" title="Warnings" className="mb-4">
              <ul className="list-inside list-disc text-sm">
                {validation.warnings.map((message) => (
                  <li key={message}>{message}</li>
                ))}
              </ul>
            </Alert>
          )}

          <div className="mb-4 flex gap-2">
            <button
              type="button"
              onClick={() => setTab('upload')}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm',
                tab === 'upload'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground',
              )}
            >
              Upload new
            </button>
            <button
              type="button"
              onClick={() => setTab('library')}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm',
                tab === 'library'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted text-muted-foreground',
              )}
            >
              Choose existing
            </button>
          </div>

          {tab === 'upload' ? (
            <VideoUploader
              onUploaded={(video) => {
                setSelectedVideo(video)
                setTab('library')
              }}
            />
          ) : (
            <VideoPicker
              selectedVideoId={selectedVideo?.id ?? null}
              onSelect={setSelectedVideo}
            />
          )}

          {selectedVideo && (
            <p className="mt-4 text-sm text-muted-foreground">
              Selected: Video #{selectedVideo.id} ({selectedVideo.format})
            </p>
          )}

          {actionError && (
            <Alert variant="error" title="Run failed" className="mt-4">
              {actionError}
            </Alert>
          )}

          {isRunning && (
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-muted/30 p-3 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Running workflow… This may take a few minutes. Please keep this tab open.
            </div>
          )}
        </div>

        <div className="flex justify-end gap-2 border-t border-border px-5 py-4">
          <Button variant="outline" onClick={onClose} disabled={isRunning}>
            Cancel
          </Button>
          <Button
            onClick={() => void handleRun()}
            disabled={!validation.canRun || isRunning || isSaving}
          >
            {isRunning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Running…
              </>
            ) : (
              <>
                <Play className="h-4 w-4" />
                {isDirty ? 'Save & run' : 'Run workflow'}
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
