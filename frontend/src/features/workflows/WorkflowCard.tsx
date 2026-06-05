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
import { Pencil, Trash2 } from 'lucide-react'

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
    <Card className="flex flex-col transition-shadow hover:shadow-md">
      <CardHeader>
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
          variant="destructive"
          size="sm"
          onClick={() => onDelete(workflow)}
          aria-label="Delete workflow"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  )
}
