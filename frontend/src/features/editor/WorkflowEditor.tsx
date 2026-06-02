import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from '@tanstack/react-router'
import { useQueryClient } from '@tanstack/react-query'
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useEdgesState,
  useNodesState,
  type Connection,
  type Edge,
  type Node,
  type ReactFlowInstance,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import './editor.css'
import { ArrowLeft, Menu, PanelRight, Play, Save, X } from 'lucide-react'
import { Alert, Button, Input } from '@/components/ui'
import { useToast } from '@/contexts/toastContext'
import { useWorkflow } from '@/hooks/useWorkflows'
import { useWorkflowNodes } from '@/hooks/useNodes'
import { useWorkflowEdges } from '@/hooks/useEdges'
import { getFriendlyErrorMessage } from '@/lib/errors'
import { nodeKeys } from '@/lib/api/nodes'
import { edgeKeys } from '@/lib/api/edges'
import { workflowKeys } from '@/lib/api/workflows'
import type { NodeTypes } from '@ondeckai/shared/types/Nodes'
import { useEditorStore } from './editorStore'
import { NodePalette, NODE_DRAG_TYPE } from './NodePalette'
import { NodeConfigPanel } from './NodeConfigPanel'
import { EditorToolbar } from './EditorToolbar'
import { workflowNodeTypes, type WorkflowNodeData } from './WorkflowNode'
import { persistWorkflowDraft } from './persistWorkflowDraft'
import {
  createFlowNode,
  createTempEdgeId,
  isWorkflowDirty,
  toFlowEdges,
  toFlowNodes,
  type WorkflowBaseline,
} from './workflowCanvasUtils'

const GRID_SIZE = 20

function snapValue(value: number, snap: boolean) {
  if (!snap) return value
  return Math.round(value / GRID_SIZE) * GRID_SIZE
}

type WorkflowEditorProps = {
  workflowId: number
}

export function WorkflowEditor({ workflowId }: WorkflowEditorProps) {
  const reactFlowRef = useRef<ReactFlowInstance | null>(null)
  const canvasRef = useRef<HTMLDivElement | null>(null)
  const hydratedWorkflowRef = useRef<number | null>(null)
  const queryClient = useQueryClient()

  const { success, error: showError } = useToast()

  const {
    data: workflow,
    isPending: workflowLoading,
    isError: workflowError,
    error: workflowLoadError,
    refetch: refetchWorkflow,
  } = useWorkflow(workflowId)
  const {
    data: apiNodes = [],
    isPending: nodesLoading,
    isError: nodesError,
    error: nodesLoadError,
    refetch: refetchNodes,
  } = useWorkflowNodes(workflowId)
  const {
    data: apiEdges = [],
    isPending: edgesLoading,
    isError: edgesError,
    error: edgesLoadError,
    refetch: refetchEdges,
  } = useWorkflowEdges(workflowId)

  const {
    selectedNodeId,
    configPanelOpen,
    paletteOpen,
    snapToGrid,
    setSelectedNodeId,
    setConfigPanelOpen,
    setPaletteOpen,
    toggleSnapToGrid,
  } = useEditorStore()

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([])
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([])
  const [baseline, setBaseline] = useState<WorkflowBaseline | null>(null)
  const [nameDraft, setNameDraft] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const isLoading = workflowLoading || nodesLoading || edgesLoading
  const loadError = workflowError
    ? workflowLoadError
    : nodesError
      ? nodesLoadError
      : edgesError
        ? edgesLoadError
        : null

  useEffect(() => {
    hydratedWorkflowRef.current = null
    setBaseline(null)
    setNodes([])
    setEdges([])
  }, [workflowId, setNodes, setEdges])

  useEffect(() => {
    if (isLoading || !workflow || loadError) return
    if (hydratedWorkflowRef.current === workflowId) return

    hydratedWorkflowRef.current = workflowId
    const nextBaseline: WorkflowBaseline = {
      name: workflow.name,
      nodes: apiNodes,
      edges: apiEdges,
    }
    setBaseline(nextBaseline)
    setNameDraft(workflow.name)
    setNodes(toFlowNodes(apiNodes))
    setEdges(toFlowEdges(apiEdges))
  }, [
    workflowId,
    workflow,
    apiNodes,
    apiEdges,
    isLoading,
    loadError,
    setNodes,
    setEdges,
  ])

  const isDirty = useMemo(() => {
    if (!baseline) return false
    return isWorkflowDirty(baseline, nodes, edges, nameDraft)
  }, [baseline, nodes, edges, nameDraft])

  useEffect(() => {
    function handleBeforeUnload(event: BeforeUnloadEvent) {
      if (!isDirty) return
      event.preventDefault()
      event.returnValue = ''
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

  const selectedNodeType = useMemo(() => {
    if (!selectedNodeId) return null
    const node = nodes.find((item) => item.id === selectedNodeId)
    return (node?.data as WorkflowNodeData | undefined)?.nodeType ?? null
  }, [selectedNodeId, nodes])

  const existingSourceEdges = useMemo(
    () => new Set(edges.map((edge) => edge.source)),
    [edges],
  )

  const addNodeAtPosition = useCallback(
    (type: NodeTypes, position: { x: number; y: number }) => {
      const x = snapValue(position.x, snapToGrid)
      const y = snapValue(position.y, snapToGrid)
      setNodes((current) => [...current, createFlowNode(type, { x, y })])
    },
    [setNodes, snapToGrid],
  )

  const handleAddNodeAtCenter = useCallback(
    (type: NodeTypes) => {
      const instance = reactFlowRef.current
      const bounds = canvasRef.current?.getBoundingClientRect()
      const center = instance && bounds
        ? instance.screenToFlowPosition({
            x: bounds.left + bounds.width / 2,
            y: bounds.top + bounds.height / 2,
          })
        : { x: 200, y: 200 }

      addNodeAtPosition(type, center)
    },
    [addNodeAtPosition],
  )

  const handleDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = 'move'
  }, [])

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault()
      const type = event.dataTransfer.getData(NODE_DRAG_TYPE) as NodeTypes
      if (!type || !reactFlowRef.current) return

      const position = reactFlowRef.current.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      })
      addNodeAtPosition(type, position)
    },
    [addNodeAtPosition],
  )

  const handleConnect = useCallback(
    (connection: Connection) => {
      if (!connection.source || !connection.target) return
      if (connection.source === connection.target) return
      if (existingSourceEdges.has(connection.source)) {
        showError('Each node can only have one outgoing connection.')
        return
      }

      setEdges((current) =>
        addEdge(
          {
            ...connection,
            id: createTempEdgeId(),
            animated: true,
          },
          current,
        ),
      )
    },
    [existingSourceEdges, setEdges, showError],
  )

  const handleNodeDragStop = useCallback(
    (_: React.MouseEvent, node: Node) => {
      const x = snapValue(node.position.x, snapToGrid)
      const y = snapValue(node.position.y, snapToGrid)

      setNodes((current) =>
        current.map((item) =>
          item.id === node.id ? { ...item, position: { x, y } } : item,
        ),
      )
    },
    [snapToGrid, setNodes],
  )

  const handleSelectionChange = useCallback(
    ({ nodes: selected }: { nodes: Node[] }) => {
      setSelectedNodeId(selected[0]?.id ?? null)
    },
    [setSelectedNodeId],
  )

  const handleNodesDelete = useCallback(() => {
    setSelectedNodeId(null)
  }, [setSelectedNodeId])

  const handleFitView = useCallback(() => {
    reactFlowRef.current?.fitView({ padding: 0.2 })
  }, [])

  const handleAutoLayout = useCallback(() => {
    const sorted = [...nodes].sort((a, b) => a.position.x - b.position.x)
    const columnWidth = 260
    const rowHeight = 120

    setNodes(
      sorted.map((node, index) => ({
        ...node,
        position: {
          x: snapValue(80 + (index % 4) * columnWidth, snapToGrid),
          y: snapValue(80 + Math.floor(index / 4) * rowHeight, snapToGrid),
        },
      })),
    )

    setTimeout(() => reactFlowRef.current?.fitView({ padding: 0.2 }), 50)
  }, [nodes, setNodes, snapToGrid])

  const handleDiscard = useCallback(() => {
    if (!baseline) return
    setNameDraft(baseline.name)
    setNodes(toFlowNodes(baseline.nodes))
    setEdges(toFlowEdges(baseline.edges))
    setSelectedNodeId(null)
    success('Changes discarded.')
  }, [baseline, setEdges, setNodes, setSelectedNodeId, success])

  const handleSave = useCallback(async () => {
    if (!baseline || !isDirty) return
    if (!nameDraft.trim()) {
      showError('Please enter a workflow name before saving.')
      return
    }

    setIsSaving(true)
    try {
      const nextBaseline = await persistWorkflowDraft(
        workflowId,
        baseline,
        nodes,
        edges,
        nameDraft,
      )
      setBaseline(nextBaseline)
      setNodes(toFlowNodes(nextBaseline.nodes))
      setEdges(toFlowEdges(nextBaseline.edges))
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: nodeKeys.byWorkflow(workflowId) }),
        queryClient.invalidateQueries({ queryKey: edgeKeys.byWorkflow(workflowId) }),
        queryClient.invalidateQueries({ queryKey: workflowKeys.detail(workflowId) }),
        queryClient.invalidateQueries({ queryKey: workflowKeys.all }),
      ])
      success('Workflow saved successfully.')
    } catch (error) {
      showError(getFriendlyErrorMessage(error, 'Could not save the workflow.'))
    } finally {
      setIsSaving(false)
    }
  }, [
    baseline,
    edges,
    isDirty,
    nameDraft,
    nodes,
    showError,
    success,
    workflowId,
    setEdges,
    setNodes,
    queryClient,
  ])

  const handleRetryLoad = useCallback(() => {
    void refetchWorkflow()
    void refetchNodes()
    void refetchEdges()
  }, [refetchWorkflow, refetchNodes, refetchEdges])

  if (isLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-sm text-muted-foreground">Loading workflow…</p>
      </div>
    )
  }

  if (loadError) {
    return (
      <div className="mx-auto max-w-lg space-y-4 p-6">
        <Alert variant="error" title="Could not load workflow">
          {getFriendlyErrorMessage(loadError)}
        </Alert>
        <div className="flex gap-2">
          <Button onClick={handleRetryLoad}>Try again</Button>
          <Link to="/dashboard/workflows">
            <Button variant="outline">Back to workflows</Button>
          </Link>
        </div>
      </div>
    )
  }

  if (!workflow || !baseline) {
    return (
      <div className="mx-auto max-w-lg space-y-4 p-6">
        <Alert variant="warning" title="Workflow not found">
          This workflow may have been deleted or you may not have access to it.
        </Alert>
        <Link to="/dashboard/workflows">
          <Button variant="outline">Back to workflows</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="flex shrink-0 items-center justify-between border-b border-border bg-card px-4 py-3">
        <div className="flex min-w-0 items-center gap-3">
          <Link to="/dashboard/workflows">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="min-w-0">
            <Input
              value={nameDraft}
              onChange={(event) => setNameDraft(event.target.value)}
              className="h-8 max-w-xs border-transparent bg-transparent font-display text-base focus-visible:border-input"
              aria-label="Workflow name"
            />
            {isDirty && (
              <p className="mt-0.5 text-xs text-muted-foreground">
                Unsaved changes
              </p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setPaletteOpen(!paletteOpen)}
            aria-label="Toggle node library"
          >
            <Menu className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setConfigPanelOpen(!configPanelOpen)}
            aria-label="Toggle configuration panel"
          >
            <PanelRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDiscard}
            disabled={!isDirty || isSaving}
          >
            Discard
          </Button>
          <Button
            size="sm"
            onClick={() => void handleSave()}
            disabled={!isDirty || isSaving}
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Saving…' : 'Save'}
          </Button>
          <Button disabled title="Execution API not available yet">
            <Play className="h-4 w-4" />
            Run
          </Button>
        </div>
      </div>

      <div className="relative flex min-h-0 flex-1 overflow-hidden">
        {paletteOpen && (
          <>
            <NodePalette
              onAddNode={handleAddNodeAtCenter}
              className="hidden h-full min-h-0 lg:flex"
            />
            <div className="absolute inset-y-0 left-0 z-20 flex lg:hidden">
              <NodePalette
                onAddNode={handleAddNodeAtCenter}
                className="h-full max-h-full min-h-0 shadow-lg"
              />
              <button
                type="button"
                className="m-2 self-start rounded-md bg-card p-1 shadow"
                onClick={() => setPaletteOpen(false)}
                aria-label="Close node library"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </>
        )}

        <div
          ref={canvasRef}
          className="workflow-canvas relative min-h-0 min-w-0 flex-1"
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={handleConnect}
            onNodeDragStop={handleNodeDragStop}
            onSelectionChange={handleSelectionChange}
            onNodesDelete={handleNodesDelete}
            onInit={(instance) => {
              reactFlowRef.current = instance
            }}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            fitView
            snapToGrid={snapToGrid}
            snapGrid={[GRID_SIZE, GRID_SIZE]}
            deleteKeyCode={['Backspace', 'Delete']}
            nodeTypes={workflowNodeTypes}
            className="h-full w-full bg-background"
            proOptions={{ hideAttribution: true }}
          >
            <Background gap={GRID_SIZE} />
            <Controls showInteractive={false} />
            <MiniMap
              nodeColor={() => 'var(--color-orange-400)'}
              maskColor="rgba(0,0,0,0.08)"
              pannable
              zoomable
            />
          </ReactFlow>
        </div>

        {configPanelOpen && (
          <>
            <NodeConfigPanel
              nodeType={selectedNodeType}
              className="hidden h-full min-h-0 lg:flex"
            />
            <div className="absolute inset-y-0 right-0 z-20 flex lg:hidden">
              <button
                type="button"
                className="m-2 self-start rounded-md bg-card p-1 shadow"
                onClick={() => setConfigPanelOpen(false)}
                aria-label="Close configuration panel"
              >
                <X className="h-4 w-4" />
              </button>
              <NodeConfigPanel
                nodeType={selectedNodeType}
                className="h-full max-h-full min-h-0 shadow-lg"
              />
            </div>
          </>
        )}
      </div>

      <EditorToolbar
        snapToGrid={snapToGrid}
        onToggleSnap={toggleSnapToGrid}
        onFitView={handleFitView}
        onAutoLayout={handleAutoLayout}
        isDirty={isDirty}
        nodeCount={nodes.length}
        edgeCount={edges.filter((edge) => edge.target).length}
      />
    </div>
  )
}
