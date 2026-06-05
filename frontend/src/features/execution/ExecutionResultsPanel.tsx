import { useState } from 'react'
import { ChevronDown, ChevronRight, FileText, Layers, X } from 'lucide-react'
import { Badge, Button } from '@/components/ui'
import { NODE_BY_TYPE } from '@/features/workflows/nodeRegistry'
import { NodeIcon } from '@/features/workflows/nodeIcons'
import type { WorkflowExecutionSummary } from '@ondeckai/shared/types/WorkflowExecutionSummary'
import { extractOutputReport } from './executionUtils'
import { NodeResultRenderer } from './resultRenderers/NodeResultRenderer'
import { SaveResultsReport } from './resultRenderers/SaveResultsReport'
import { cn } from '@/lib/cn'

type ExecutionResultsPanelProps = {
  summary: WorkflowExecutionSummary
  onClose: () => void
  className?: string
}

type ResultsTab = 'report' | 'nodes'

export function ExecutionResultsPanel({
  summary,
  onClose,
  className,
}: ExecutionResultsPanelProps) {
  const outputReport = extractOutputReport(summary)
  const [activeTab, setActiveTab] = useState<ResultsTab>(outputReport ? 'report' : 'nodes')
  const [expanded, setExpanded] = useState<Set<number>>(
    () => new Set(summary.nodeResults.map((r) => r.nodeId)),
  )
  const [rawNodes, setRawNodes] = useState<Set<number>>(new Set())

  const toggleExpanded = (nodeId: number) => {
    setExpanded((current) => {
      const next = new Set(current)
      if (next.has(nodeId)) next.delete(nodeId)
      else next.add(nodeId)
      return next
    })
  }

  const toggleRaw = (nodeId: number) => {
    setRawNodes((current) => {
      const next = new Set(current)
      if (next.has(nodeId)) next.delete(nodeId)
      else next.add(nodeId)
      return next
    })
  }

  const orderedResults = summary.executionOrder
    .map((nodeId) => summary.nodeResults.find((r) => r.nodeId === nodeId))
    .filter((r): r is NonNullable<typeof r> => Boolean(r))

  return (
    <aside
      className={cn(
        'flex w-[28rem] shrink-0 flex-col overflow-hidden border-l border-border/50 bg-background/95 backdrop-blur-xl',
        className,
      )}
    >
      <div className="flex shrink-0 items-center justify-between border-b border-border/50 px-4 py-3">
        <div>
          <h3 className="text-sm font-medium text-foreground">Run results</h3>
          <p className="text-xs text-muted-foreground">
            Execution #{summary.executionId}
          </p>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose} aria-label="Close results">
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="shrink-0 border-b border-border/50 px-4 py-3">
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant={summary.status === 'completed' ? 'default' : 'muted'}>
            {summary.status}
          </Badge>
          <span className="text-xs text-muted-foreground">
            Video #{summary.videoId}
          </span>
        </div>
        {summary.skippedDanglingNodes.length > 0 && (
          <p className="mt-2 text-xs text-muted-foreground">
            Skipped {summary.skippedDanglingNodes.length} disconnected node(s).
          </p>
        )}
      </div>

      <div className="flex shrink-0 gap-1 border-b border-border/50 p-2">
        <button
          type="button"
          onClick={() => setActiveTab('report')}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-colors',
            activeTab === 'report'
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
          )}
        >
          <FileText className="h-3.5 w-3.5" />
          Final report
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('nodes')}
          className={cn(
            'flex flex-1 items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition-colors',
            activeTab === 'nodes'
              ? 'bg-primary/10 text-primary'
              : 'text-muted-foreground hover:bg-muted/50 hover:text-foreground',
          )}
        >
          <Layers className="h-3.5 w-3.5" />
          Node outputs
        </button>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto p-4">
        {activeTab === 'report' ? (
          <div className="space-y-3">
            {outputReport ? (
              <SaveResultsReport output={{ output_report: outputReport }} />
            ) : (
              <div className="rounded-lg border border-dashed border-border/60 bg-muted/20 px-4 py-8 text-center">
                <FileText className="mx-auto mb-2 h-8 w-8 text-muted-foreground/50" />
                <p className="text-sm font-medium text-foreground">No report yet</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Add a Save Results node to your workflow to generate a final report.
                </p>
              </div>
            )}
          </div>
        ) : (
          <ul className="space-y-3">
            {orderedResults.map((result) => {
              const definition = NODE_BY_TYPE[result.type]
              const isOpen = expanded.has(result.nodeId)
              const showRaw = rawNodes.has(result.nodeId)

              return (
                <li
                  key={result.nodeId}
                  className="rounded-lg border border-border/50 bg-muted/20"
                >
                  <button
                    type="button"
                    onClick={() => toggleExpanded(result.nodeId)}
                    className="flex w-full items-center gap-2 px-3 py-2 text-left"
                  >
                    {isOpen ? (
                      <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                    ) : (
                      <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                    )}
                    <NodeIcon type={result.type} className="h-4 w-4" />
                    <span className="text-sm font-medium">{definition.label}</span>
                  </button>

                  {isOpen && (
                    <div className="space-y-2 border-t border-border/50 px-3 py-3">
                      <button
                        type="button"
                        onClick={() => toggleRaw(result.nodeId)}
                        className="text-xs text-primary hover:underline"
                      >
                        {showRaw ? 'Hide raw JSON' : 'View raw JSON'}
                      </button>
                      <NodeResultRenderer
                        nodeType={result.type}
                        output={result.output}
                        showRaw={showRaw}
                      />
                    </div>
                  )}
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </aside>
  )
}
