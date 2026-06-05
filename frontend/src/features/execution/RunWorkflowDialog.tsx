import { useMemo, useState } from 'react'
import type { Edge, Node } from '@xyflow/react'
import { Loader2, Play } from 'lucide-react'
import {
  Alert,
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui'
import { VideoPicker } from '@/features/videos/VideoPicker'
import { VideoUploader } from '@/features/videos/VideoUploader'
import type { VideoWithDelivery } from '@ondeckai/shared/types/VideoApi'
import type { WorkflowBaseline } from '@/features/editor/workflowCanvasUtils'
import { validateWorkflowForRun } from './validateWorkflowForRun'

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
  const [selectedVideo, setSelectedVideo] = useState<VideoWithDelivery | null>(null)
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
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && !isRunning && onClose()}>
      <DialogContent
        className="flex max-h-[90vh] max-w-lg flex-col overflow-hidden p-0"
        onClose={isRunning ? undefined : onClose}
      >
        <div className="px-6 pt-6">
          <DialogHeader
            title="Run workflow"
            description={`${nodes.length} nodes · ${edges.length} connections`}
            onClose={isRunning ? undefined : onClose}
          />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-4">
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

          <Tabs>
            <TabsList className="mb-4 w-full">
              <TabsTrigger value="upload" activeValue={tab} onSelect={(v) => setTab(v as Tab)}>
                Upload new
              </TabsTrigger>
              <TabsTrigger value="library" activeValue={tab} onSelect={(v) => setTab(v as Tab)}>
                Choose existing
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" activeValue={tab}>
              <VideoUploader
                onUploaded={(video) => {
                  setSelectedVideo(video)
                  setTab('library')
                }}
              />
            </TabsContent>

            <TabsContent value="library" activeValue={tab}>
              <VideoPicker
                selectedVideoId={selectedVideo?.id ?? null}
                onSelect={setSelectedVideo}
              />
            </TabsContent>
          </Tabs>

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
            <div className="mt-4 flex items-center gap-2 rounded-lg border border-border/50 bg-muted/30 p-3 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin text-primary" />
              Running workflow… This may take a few minutes. Please keep this tab open.
            </div>
          )}
        </div>

        <Separator />
        <DialogFooter className="px-6 py-4">
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
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
