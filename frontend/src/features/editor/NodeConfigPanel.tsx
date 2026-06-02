import { useDropzone } from 'react-dropzone'
import { NODE_BY_TYPE } from '@/features/workflows/nodeRegistry'
import { NodeIcon } from '@/features/workflows/nodeIcons'
import type { NodeTypes } from '@ondeckai/shared/types/Nodes'
import { cn } from '@/lib/cn'

type NodeConfigPanelProps = {
  nodeType: NodeTypes | null
  className?: string
}

export function NodeConfigPanel({ nodeType, className }: NodeConfigPanelProps) {
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
            Select a node to view its configuration preview.
          </p>
        </div>
      </aside>
    )
  }

  const definition = NODE_BY_TYPE[nodeType]
  const isUpload = nodeType === 'upload_video'

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    disabled: true,
    noClick: true,
    noKeyboard: true,
  })

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
            <p className="text-xs text-muted-foreground">Configuration preview</p>
          </div>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-4">
        <p className="text-sm text-muted-foreground">{definition.description}</p>

        <div className="mt-4 rounded-lg border border-dashed border-border bg-muted/30 p-3">
          <p className="text-xs text-muted-foreground">
            Configuration saves when the API supports node settings.
          </p>
        </div>

        {isUpload && (
          <div
            {...getRootProps()}
            className={cn(
              'mt-4 cursor-not-allowed rounded-lg border border-dashed border-border p-6 text-center opacity-60',
              isDragActive && 'border-primary',
            )}
          >
            <input {...getInputProps()} />
            <p className="text-sm font-medium text-foreground">
              Drop video here
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Upload will be available when the video API is ready.
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
                  disabled
                  placeholder={field.placeholder}
                  rows={3}
                  className="w-full cursor-not-allowed rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm opacity-60"
                />
              ) : field.type === 'select' ? (
                <select
                  disabled
                  className="w-full cursor-not-allowed rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm opacity-60"
                >
                  {field.options?.map((opt) => (
                    <option key={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  disabled
                  type={field.type ?? 'text'}
                  placeholder={field.placeholder}
                  className="w-full cursor-not-allowed rounded-lg border border-input bg-muted/50 px-3 py-2 text-sm opacity-60"
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </aside>
  )
}
