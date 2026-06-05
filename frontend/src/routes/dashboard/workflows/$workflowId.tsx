import { createFileRoute } from '@tanstack/react-router'
import { WorkflowEditor } from '@/features/editor/WorkflowEditor'
import { useSetDashboardHeader } from '@/contexts/dashboardHeaderContext'

export const Route = createFileRoute('/dashboard/workflows/$workflowId')({
  staticData: { fullBleed: true },
  validateSearch: (
    search: Record<string, unknown>,
  ): { executionId?: number } => {
    const raw = search.executionId
    if (raw == null || raw === '') return {}
    const parsed = Number(raw)
    return Number.isFinite(parsed) ? { executionId: parsed } : {}
  },
  component: WorkflowEditorPage,
})

function WorkflowEditorPage() {
  const { workflowId } = Route.useParams()
  const { executionId } = Route.useSearch()
  const id = Number(workflowId)

  useSetDashboardHeader({
    title: 'Workflow editor',
    subtitle: '',
  })

  return (
    <WorkflowEditor
      workflowId={id}
      initialExecutionId={
        executionId != null && Number.isFinite(executionId) ? executionId : undefined
      }
    />
  )
}
