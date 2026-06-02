import { createFileRoute } from '@tanstack/react-router'
import { useSetDashboardHeader } from '@/contexts/dashboardHeaderContext'
import { WorkflowList } from '@/features/workflows/WorkflowList'

export const Route = createFileRoute('/dashboard/workflows/')({
  component: WorkflowsPage,
})

function WorkflowsPage() {
  useSetDashboardHeader({ title: 'Workflows', subtitle: 'Pipeline builder' })

  return <WorkflowList />
}
