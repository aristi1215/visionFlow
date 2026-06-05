import { Link } from '@tanstack/react-router'
import { useUser } from '@clerk/react'
import { History, Network, Plus } from 'lucide-react'
import {
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Skeleton,
} from '@/components/ui'
import {
  DataTable,
  DataTableBody,
  DataTableCell,
  DataTableHead,
  DataTableHeader,
  DataTableRow,
  EmptyState,
} from '@/components/layout'
import { useSetDashboardHeader } from '@/contexts/dashboardHeaderContext'
import { useWorkflows } from '@/hooks/useWorkflows'
import { useRecentExecutions } from '@/hooks/useExecutions'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardOverview,
})

function DashboardOverview() {
  useSetDashboardHeader({ title: 'Overview', subtitle: '' })

  const { user } = useUser()
  const { data: workflows = [], isPending } = useWorkflows()
  const { data: executions = [], isPending: executionsPending } = useRecentExecutions()

  const sorted = [...workflows].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )
  const latest = sorted[0]

  const firstName =
    user?.firstName ?? user?.username ?? 'there'

  return (
    <div className="space-y-8">
      <section className="space-y-3 animate-in">
        <Badge>Video analysis</Badge>
        <h2 className="text-3xl font-semibold tracking-tight text-foreground">
          Welcome back, {firstName}
        </h2>
        <p className="max-w-2xl text-muted-foreground">
          Build workflows to upload video, extract insights, detect objects,
          generate timelines, and send alerts — all from a visual canvas.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3 animate-in" style={{ animationDelay: '60ms' }}>
        <Card>
          <CardHeader>
            <CardDescription>Total workflows</CardDescription>
            <CardTitle className="text-4xl font-semibold tabular-nums">
              {isPending ? '—' : workflows.length}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Latest workflow</CardDescription>
            <CardTitle className="truncate text-lg">
              {isPending ? '—' : latest?.name ?? 'None yet'}
            </CardTitle>
            {latest && (
              <CardDescription>
                {new Date(latest.created_at).toLocaleDateString()}
              </CardDescription>
            )}
          </CardHeader>
        </Card>
        <Card className="flex flex-col justify-center">
          <CardContent className="pt-0">
            <Link to="/dashboard/workflows">
              <Button className="w-full">
                <Plus className="h-4 w-4" />
                Build a workflow
              </Button>
            </Link>
          </CardContent>
        </Card>
      </section>

      <section className="animate-in" style={{ animationDelay: '120ms' }}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Recent workflows</h3>
          <Link
            to="/dashboard/workflows"
            className="text-sm text-primary hover:underline"
          >
            View all
          </Link>
        </div>

        {isPending ? (
          <Skeleton className="h-32" />
        ) : sorted.length === 0 ? (
          <EmptyState
            icon={Network}
            title="No workflows yet"
            description="Create one to get started with video analysis."
            action={
              <Link to="/dashboard/workflows">
                <Button size="sm">Create workflow</Button>
              </Link>
            }
          />
        ) : (
          <DataTable>
            <DataTableHeader>
              <tr>
                <DataTableHead>Name</DataTableHead>
                <DataTableHead className="hidden sm:table-cell">Description</DataTableHead>
                <DataTableHead>Created</DataTableHead>
                <DataTableHead />
              </tr>
            </DataTableHeader>
            <DataTableBody>
              {sorted.slice(0, 5).map((workflow) => (
                <DataTableRow key={workflow.id}>
                  <DataTableCell className="font-medium">{workflow.name}</DataTableCell>
                  <DataTableCell className="hidden max-w-xs truncate text-muted-foreground sm:table-cell">
                    {workflow.description || '—'}
                  </DataTableCell>
                  <DataTableCell className="text-muted-foreground">
                    {new Date(workflow.created_at).toLocaleDateString()}
                  </DataTableCell>
                  <DataTableCell className="text-right">
                    <Link
                      to="/dashboard/workflows/$workflowId"
                      params={{ workflowId: String(workflow.id) }}
                      search={{}}
                      className="text-primary hover:underline"
                    >
                      Open
                    </Link>
                  </DataTableCell>
                </DataTableRow>
              ))}
            </DataTableBody>
          </DataTable>
        )}
      </section>

      <section className="animate-in" style={{ animationDelay: '180ms' }}>
        <div className="mb-4 flex items-center gap-2">
          <History className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold text-foreground">Execution history</h3>
        </div>

        {executionsPending ? (
          <Skeleton className="h-32" />
        ) : executions.length === 0 ? (
          <EmptyState
            icon={History}
            title="No runs yet"
            description="Open a workflow and click Run to execute it."
          />
        ) : (
          <DataTable>
            <DataTableHeader>
              <tr>
                <DataTableHead>Workflow</DataTableHead>
                <DataTableHead>Status</DataTableHead>
                <DataTableHead>Started</DataTableHead>
                <DataTableHead>Video</DataTableHead>
                <DataTableHead />
              </tr>
            </DataTableHeader>
            <DataTableBody>
              {executions.slice(0, 10).map((execution) => (
                <DataTableRow key={execution.id}>
                  <DataTableCell className="font-medium">
                    {execution.workflow_name ?? `Workflow #${execution.workflow_id}`}
                  </DataTableCell>
                  <DataTableCell>
                    <Badge variant={execution.status === 'completed' ? 'default' : 'muted'}>
                      {execution.status}
                    </Badge>
                  </DataTableCell>
                  <DataTableCell className="text-muted-foreground">
                    {new Date(execution.started_at).toLocaleString()}
                  </DataTableCell>
                  <DataTableCell className="text-muted-foreground">
                    #{execution.video_id}
                  </DataTableCell>
                  <DataTableCell className="text-right">
                    <Link
                      to="/dashboard/workflows/$workflowId"
                      params={{ workflowId: String(execution.workflow_id) }}
                      search={{ executionId: execution.id }}
                      className="text-primary hover:underline"
                    >
                      View results
                    </Link>
                  </DataTableCell>
                </DataTableRow>
              ))}
            </DataTableBody>
          </DataTable>
        )}
      </section>
    </div>
  )
}
