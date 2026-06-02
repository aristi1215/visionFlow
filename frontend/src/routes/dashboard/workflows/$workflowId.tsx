import { createFileRoute } from '@tanstack/react-router'
import { WorkflowEditor } from '@/features/editor/WorkflowEditor'
import { useSetDashboardHeader } from '@/contexts/dashboardHeaderContext'

export const Route = createFileRoute('/dashboard/workflows/$workflowId')({
  staticData: { fullBleed: true },
  component: WorkflowEditorPage,
})

function WorkflowEditorPage() {
  const { workflowId } = Route.useParams()
  const id = Number(workflowId)

  useSetDashboardHeader({
    title: 'Workflow editor',
    subtitle: 'Canvas',
  })

  return <WorkflowEditor workflowId={id} />
}
