import { useState } from 'react'
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  Input,
  Label,
  Textarea,
} from '@/components/ui'

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
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="max-w-md" onClose={handleClose}>
        <DialogHeader
          title="New workflow"
          description="Create a video analysis pipeline by connecting nodes on the canvas."
          onClose={handleClose}
        />

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="workflow-name">Name</Label>
            <Input
              id="workflow-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Warehouse safety review"
              autoFocus
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="workflow-description">Description</Label>
            <Textarea
              id="workflow-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this workflow analyzes..."
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isPending || !name.trim()}>
              {isPending ? 'Creating…' : 'Create workflow'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
