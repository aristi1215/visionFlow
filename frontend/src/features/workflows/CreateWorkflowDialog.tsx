import { useState } from 'react'
import { Button, Input } from '@/components/ui'
import { cn } from '@/lib/cn'

type CreateWorkflowDialogProps = {
  open: boolean
  onClose: () => void
  onSubmit: (data: { name: string; description: string }) => void
  isPending?: boolean
}

export function CreateWorkflowDialog({
  open,
  onClose,
  onSubmit,
  isPending,
}: CreateWorkflowDialogProps) {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  if (!open) return null

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim()) return
    onSubmit({ name: name.trim(), description: description.trim() })
  }

  function handleClose() {
    setName('')
    setDescription('')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div
        className={cn(
          'w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg',
        )}
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-workflow-title"
      >
        <h2
          id="create-workflow-title"
          className="font-display text-xl text-foreground"
        >
          New workflow
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Create a video analysis pipeline by connecting nodes on the canvas.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label
              htmlFor="workflow-name"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Name
            </label>
            <Input
              id="workflow-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Warehouse safety review"
              autoFocus
              required
            />
          </div>
          <div>
            <label
              htmlFor="workflow-description"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Description
            </label>
            <textarea
              id="workflow-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this workflow analyzes..."
              rows={3}
              className={cn(
                'flex w-full rounded-lg border border-input bg-card px-3 py-2 text-sm text-foreground',
                'placeholder:text-muted-foreground',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
              )}
            />
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !name.trim()}>
              {isPending ? 'Creating…' : 'Create workflow'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
