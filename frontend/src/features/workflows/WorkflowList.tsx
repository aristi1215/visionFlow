import { useState } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Network, Plus } from 'lucide-react'
import {
  Alert,
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  Input,
  Label,
  Skeleton,
} from '@/components/ui'
import { EmptyState, PageHeader } from '@/components/layout'
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
  const [deleteTarget, setDeleteTarget] = useState<WorkflowRow | null>(null)

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

  function handleDeleteStart(workflow: WorkflowRow) {
    setDeleteTarget(workflow)
  }

  async function handleDeleteConfirm() {
    if (!deleteTarget) return
    try {
      await deleteWorkflow.mutateAsync(deleteTarget.id)
      setDeleteTarget(null)
      toast.success('Workflow deleted.')
    } catch (err) {
      toast.error(getFriendlyErrorMessage(err, 'Could not delete the workflow.'))
    }
  }

  if (isPending) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-48" />
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
      <PageHeader
        title="Workflows"
        description="Build video analysis pipelines with connected nodes."
        action={
          <Button onClick={() => setDialogOpen(true)}>
            <Plus className="h-4 w-4" />
            New workflow
          </Button>
        }
      />

      {workflows.length === 0 ? (
        <EmptyState
          icon={Network}
          title="Create your first workflow"
          description="Drag nodes onto a canvas, connect them, and analyze video content step by step."
          action={
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="h-4 w-4" />
              New workflow
            </Button>
          }
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {workflows.map((workflow) => (
            <WorkflowCard
              key={workflow.id}
              workflow={workflow}
              onRename={handleRenameStart}
              onDelete={handleDeleteStart}
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

      <Dialog
        open={!!renameTarget}
        onOpenChange={(open) => !open && setRenameTarget(null)}
      >
        <DialogContent className="max-w-sm" onClose={() => setRenameTarget(null)}>
          <form onSubmit={handleRenameSubmit}>
            <DialogHeader
              title="Rename workflow"
              onClose={() => setRenameTarget(null)}
            />
            <div className="space-y-2">
              <Label htmlFor="rename-name">Name</Label>
              <Input
                id="rename-name"
                value={renameName}
                onChange={(e) => setRenameName(e.target.value)}
                autoFocus
                required
              />
            </div>
            <DialogFooter>
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
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <DialogContent className="max-w-sm" onClose={() => setDeleteTarget(null)}>
          <DialogHeader
            title="Delete workflow"
            description={
              deleteTarget
                ? `Delete "${deleteTarget.name}"? This will remove all nodes and edges.`
                : undefined
            }
            onClose={() => setDeleteTarget(null)}
          />
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteTarget(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => void handleDeleteConfirm()}
              disabled={deleteWorkflow.isPending}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
