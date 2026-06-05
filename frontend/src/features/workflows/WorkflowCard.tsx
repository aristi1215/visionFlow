import { Link } from '@tanstack/react-router'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Button,
} from '@/components/ui'
import type { WorkflowRow } from '@ondeckai/shared/types/Workflows'
import { Network, Pencil, Trash2 } from 'lucide-react'
import { cn } from '@/lib/cn'

type WorkflowCardProps = {
  workflow: WorkflowRow
  onRename: (workflow: WorkflowRow) => void
  onDelete: (workflow: WorkflowRow) => void
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export function WorkflowCard({ workflow, onRename, onDelete }: WorkflowCardProps) {
  return (
    <Card
      className={cn(
        'group flex flex-col border-border/50 transition-all duration-200 hover:border-primary/30 hover-lift',
      )}
    >
      <div className="h-1 rounded-t-xl bg-gradient-to-r from-primary/60 to-violet-500/40 opacity-0 transition-opacity group-hover:opacity-100" />
      <CardHeader>
        <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Network className="h-4 w-4" />
        </div>
        <CardTitle className="line-clamp-1">{workflow.name}</CardTitle>
        <CardDescription className="line-clamp-2">
          {workflow.description || 'No description'}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-xs text-muted-foreground">
          Created {formatDate(workflow.created_at)}
        </p>
      </CardContent>
      <CardFooter className="gap-2">
        <Link
          to="/dashboard/workflows/$workflowId"
          params={{ workflowId: String(workflow.id) }}
          search={{}}
          className="flex-1"
        >
          <Button className="w-full" size="sm">
            Open editor
          </Button>
        </Link>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onRename(workflow)}
          aria-label="Rename workflow"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(workflow)}
          aria-label="Delete workflow"
          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
