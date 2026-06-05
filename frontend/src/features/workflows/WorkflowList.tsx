import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Network, Plus } from 'lucide-react'
import { Alert, Button, Input } from '@/components/ui'
import { useToast } from '@/contexts/toastContext'
import { getFriendlyErrorMessage } from '@/lib/errors'
import {
  useCreateWorkflow,
  useDeleteWorkflow,
  useUpdateWorkflow,
  useWorkflows,
} from '@/hooks/useWorkflows'
import { CreateWorkflowDialog } from './CreateWorkflowDialog'
import { WorkflowCard } from './WorkflowCard'
import type { WorkflowRow } from '@ondeckai/shared/types/Workflows'
import { cn } from '@/lib/cn'

export function WorkflowList() {
  const navigate = useNavigate()
  const toast = useToast()
  const { data: workflows = [], isPending, isError, error, refetch } = useWorkflows()
  const createWorkflow = useCreateWorkflow()
  const updateWorkflow = useUpdateWorkflow()
  const deleteWorkflow = useDeleteWorkflow()

  const [dialogOpen, setDialogOpen] = useState(false)
  const [renameTarget, setRenameTarget] = useState<WorkflowRow | null>(null)
  const [renameName, setRenameName] = useState('')

  async function handleCreate(data: { name: string; description: string }) {
    try {
      const workflow = await createWorkflow.mutateAsync(data)
      setDialogOpen(false)
      toast.success('Workflow created.')
      navigate({
        to: '/dashboard/workflows/$workflowId',
        params: { workflowId: String(workflow.id) },
        search: {},
      })
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err, 'Could not create the workflow.'))
    }
  }

  function handleRenameStart(workflow: WorkflowRow) {
    setRenameTarget(workflow)
    setRenameName(workflow.name)
  }

  async function handleRenameSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!renameTarget || !renameName.trim()) return
    try {
      await updateWorkflow.mutateAsync({
        id: renameTarget.id,
        name: renameName.trim(),
      })
      setRenameTarget(null)
      setRenameName('')
      toast.success('Workflow renamed.')
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err, 'Could not rename the workflow.'))
    }
  }

  async function handleDelete(workflow: WorkflowRow) {
    if (
      !window.confirm(
        `Delete "${workflow.name}"? This will remove all nodes and edges.`,
      )
    ) {
      return
    }
    try {
      await deleteWorkflow.mutateAsync(workflow.id)
      toast.success('Workflow deleted.')
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err, 'Could not delete the workflow.'))
    }
  }

  if (isPending) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-48 animate-pulse rounded-xl border border-border bg-muted/30"
          />
        ))}
      </div>
    )
  }

  if (isError) {
    return (
      <div className="space-y-4">
        <Alert variant="error" title="Could not load workflows">
          {getFriendlyErrorMessage(error)}
        </Alert>
        <Button onClick={() => void refetch()}>Try again</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl text-foreground">Workflows</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Build video analysis pipelines with connected nodes.
          </p>
        </div>
        <Button onClick={() => setDialogOpen(true)}>
          <Plus className="h-4 w-4" />
          New workflow
        </Button>
      </div>

      {workflows.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border py-16 text-center">
          <div className="mb-4 rounded-full bg-muted p-4">
            <Network className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="font-display text-lg text-foreground">
            Create your first workflow
          </h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Drag nodes onto a canvas, connect them, and analyze video content
            step by step.
          </p>
          <Button className="mt-6" onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            New workflow
          </Button>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {workflows.map((workflow) => (
            <WorkflowCard
              key={workflow.id}
              workflow={workflow}
              onRename={handleRenameStart}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <CreateWorkflowDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleCreate}
        isPending={createWorkflow.isPending}
      />

      {renameTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <form
            onSubmit={handleRenameSubmit}
            className={cn(
              'w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-lg',
            )}
          >
            <h2 className="font-display text-lg text-foreground">
              Rename workflow
            </h2>
            <Input
              className="mt-4"
              value={renameName}
              onChange={(e) => setRenameName(e.target.value)}
              autoFocus
              required
            />
            <div className="mt-4 flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setRenameTarget(null)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={updateWorkflow.isPending}>
                Save
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
