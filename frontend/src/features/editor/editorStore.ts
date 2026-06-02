import { create } from 'zustand'

type EditorUiState = {
  selectedNodeId: string | null
  configPanelOpen: boolean
  paletteOpen: boolean
  snapToGrid: boolean
  setSelectedNodeId: (id: string | null) => void
  setConfigPanelOpen: (open: boolean) => void
  setPaletteOpen: (open: boolean) => void
  toggleSnapToGrid: () => void
}

export const useEditorStore = create<EditorUiState>((set) => ({
  selectedNodeId: null,
  configPanelOpen: true,
  paletteOpen: true,
  snapToGrid: true,
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  setConfigPanelOpen: (open) => set({ configPanelOpen: open }),
  setPaletteOpen: (open) => set({ paletteOpen: open }),
  toggleSnapToGrid: () => set((s) => ({ snapToGrid: !s.snapToGrid })),
}))
