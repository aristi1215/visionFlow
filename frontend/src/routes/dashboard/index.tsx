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
} from '@/components/ui'
import { useSetDashboardHeader } from '@/contexts/dashboardHeaderContext'
import { useWorkflows } from '@/hooks/useWorkflows'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/dashboard/')({
  component: DashboardOverview,
})

function DashboardOverview() {
  useSetDashboardHeader({ title: 'Dashboard', subtitle: 'Overview' })

  const { user } = useUser()
  const { data: workflows = [], isPending } = useWorkflows()

  const sorted = [...workflows].sort(
    (a, b) =>
      new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
  )
  const latest = sorted[0]

  const firstName =
    user?.firstName ?? user?.username ?? 'there'

  return (
    <div className="space-y-8">
      <section className="space-y-3">
        <Badge variant="orange">Video analysis</Badge>
        <h2 className="font-display text-3xl text-foreground">
          Welcome back, {firstName}
        </h2>
        <p className="max-w-2xl text-muted-foreground">
          Build workflows to upload video, extract insights, detect objects,
          generate timelines, and send alerts — all from a visual canvas.
        </p>
      </section>

      <section className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>Total workflows</CardDescription>
            <CardTitle className="text-3xl">
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

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-display text-xl text-foreground">
            Recent workflows
          </h3>
          <Link
            to="/dashboard/workflows"
            className="text-sm text-primary hover:underline"
          >
            View all
          </Link>
        </div>

        {isPending ? (
          <div className="h-32 animate-pulse rounded-xl border border-border bg-muted/30" />
        ) : sorted.length === 0 ? (
          <Card className="border-dashed">
            <CardContent className="flex flex-col items-center py-10 text-center">
              <Network className="mb-3 h-8 w-8 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No workflows yet. Create one to get started.
              </p>
              <Link to="/dashboard/workflows" className="mt-4">
                <Button size="sm">Create workflow</Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead className="border-b border-border bg-muted/40">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Name
                  </th>
                  <th className="hidden px-4 py-3 text-left font-medium text-muted-foreground sm:table-cell">
                    Description
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Created
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {sorted.slice(0, 5).map((workflow) => (
                  <tr
                    key={workflow.id}
                    className="border-b border-border last:border-0"
                  >
                    <td className="px-4 py-3 font-medium text-foreground">
                      {workflow.name}
                    </td>
                    <td className="hidden max-w-xs truncate px-4 py-3 text-muted-foreground sm:table-cell">
                      {workflow.description || '—'}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {new Date(workflow.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        to="/dashboard/workflows/$workflowId"
                        params={{ workflowId: String(workflow.id) }}
                        className="text-primary hover:underline"
                      >
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <Card className="border-dashed">
          <CardHeader>
            <div className="flex items-center gap-2">
              <History className="h-5 w-5 text-muted-foreground" />
              <CardTitle className="text-lg">Execution history</CardTitle>
            </div>
            <CardDescription>
              Execution history will appear here once runs are supported by the
              API.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              When workflow execution is enabled, you will see past runs,
              status, and results here.
            </p>
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
