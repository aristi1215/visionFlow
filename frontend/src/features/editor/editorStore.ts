import { create } from 'zustand'
import type { WorkflowExecutionSummary } from '@ondeckai/shared/types/WorkflowExecutionSummary'

export type ExecutionPhase = 'idle' | 'uploading' | 'running' | 'success' | 'error'

type EditorUiState = {
  selectedNodeId: string | null
  configPanelOpen: boolean
  paletteOpen: boolean
  resultsPanelOpen: boolean
  runDialogOpen: boolean
  snapToGrid: boolean
  executionPhase: ExecutionPhase
  lastExecution: WorkflowExecutionSummary | null
  setSelectedNodeId: (id: string | null) => void
  setConfigPanelOpen: (open: boolean) => void
  setPaletteOpen: (open: boolean) => void
  setResultsPanelOpen: (open: boolean) => void
  setRunDialogOpen: (open: boolean) => void
  setExecutionPhase: (phase: ExecutionPhase) => void
  setLastExecution: (summary: WorkflowExecutionSummary | null) => void
  toggleSnapToGrid: () => void
}

export const useEditorStore = create<EditorUiState>((set) => ({
  selectedNodeId: null,
  configPanelOpen: true,
  paletteOpen: true,
  resultsPanelOpen: false,
  runDialogOpen: false,
  snapToGrid: true,
  executionPhase: 'idle',
  lastExecution: null,
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  setConfigPanelOpen: (open) => set({ configPanelOpen: open }),
  setPaletteOpen: (open) => set({ paletteOpen: open }),
  setResultsPanelOpen: (open) => set({ resultsPanelOpen: open }),
  setRunDialogOpen: (open) => set({ runDialogOpen: open }),
  setExecutionPhase: (phase) => set({ executionPhase: phase }),
  setLastExecution: (summary) => set({ lastExecution: summary }),
  toggleSnapToGrid: () => set((s) => ({ snapToGrid: !s.snapToGrid })),
}))
