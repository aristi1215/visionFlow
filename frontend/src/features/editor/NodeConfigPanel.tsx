import { NODE_BY_TYPE } from '@/features/workflows/nodeRegistry'
import {
  getConfigValue,
  setConfigValue,
} from '@/features/workflows/configKeys'
import { NodeIcon } from '@/features/workflows/nodeIcons'
import type { NodeTypes } from '@ondeckai/shared/types/Nodes'
import { cn } from '@/lib/cn'

type NodeConfigPanelProps = {
  nodeType: NodeTypes | null
  config: Record<string, unknown>
  onConfigChange: (config: Record<string, unknown>) => void
  className?: string
}

export function NodeConfigPanel({
  nodeType,
  config,
  onConfigChange,
  className,
}: NodeConfigPanelProps) {
  if (!nodeType) {
    return (
      <aside
        className={cn(
          'flex w-72 shrink-0 flex-col overflow-hidden border-l border-border bg-card',
          className,
        )}
      >
        <div className="flex flex-1 items-center justify-center p-6 text-center">
          <p className="text-sm text-muted-foreground">
            Select a node to configure it.
          </p>
        </div>
      </aside>
    )
  }

  const definition = NODE_BY_TYPE[nodeType]
  const isUpload = nodeType === 'upload_video'

  const handleFieldChange = (label: string, value: string) => {
    onConfigChange(setConfigValue(config, label, value))
  }

  return (
    <aside
      className={cn(
        'flex w-72 shrink-0 flex-col overflow-hidden border-l border-border bg-card',
        className,
      )}
    >
      <div className="shrink-0 border-b border-border px-4 py-3">
        <div className="flex items-center gap-2">
          <div className="rounded-md bg-muted p-1.5">
            <NodeIcon type={nodeType} className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground">
              {definition.label}
            </h3>
            <p className="text-xs text-muted-foreground">Node configuration</p>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
        <p className="text-sm text-muted-foreground">{definition.description}</p>

        {isUpload && (
          <div className="mt-4 rounded-lg border border-dashed border-border bg-muted/30 p-3">
            <p className="text-xs text-muted-foreground">
              Video input is selected when you run the workflow. Use the Run
              button to upload or pick an existing video.
            </p>
          </div>
        )}

        <div className="mt-4 space-y-3">
          {definition.configFields.map((field) => (
            <div key={field.label}>
              <label className="mb-1 block text-xs font-medium text-muted-foreground">
                {field.label}
              </label>
              {field.type === 'textarea' ? (
                <textarea
                  value={getConfigValue(config, field.label)}
                  onChange={(e) => handleFieldChange(field.label, e.target.value)}
                  placeholder={field.placeholder}
                  rows={3}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                />
              ) : field.type === 'select' ? (
                <select
                  value={getConfigValue(config, field.label) || field.options?.[0]}
                  onChange={(e) => handleFieldChange(field.label, e.target.value)}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                >
                  {field.options?.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={field.type ?? 'text'}
                  value={getConfigValue(config, field.label)}
                  onChange={(e) => handleFieldChange(field.label, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
