import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { saveCanvasState, loadCanvasState } from '@/lib/storage';

export interface CanvasState {
  zoomLevel: number;
  panX: number;
  panY: number;
  showGrid: boolean;
  gridSize: number;
  isExporting: boolean;
  exportFormat: 'png' | 'jpg' | 'svg';
  exportQuality: number;
  autoFit: boolean;
  renderError: string | null;
  editMode: boolean;
}

export interface CanvasActions {
  setZoom: (zoomLevel: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
  resetZoom: () => void;
  setPan: (panX: number, panY: number) => void;
  resetPan: () => void;
  toggleGrid: () => void;
  setGridSize: (gridSize: number) => void;
  setExporting: (isExporting: boolean) => void;
  setExportFormat: (exportFormat: 'png' | 'jpg' | 'svg') => void;
  setExportQuality: (exportQuality: number) => void;
  toggleAutoFit: () => void;
  setRenderError: (error: string | null) => void;
  toggleEditMode: () => void;
  resetCanvas: () => void;
}

export type CanvasStore = CanvasState & CanvasActions;

// Initialize with stored values or defaults
const getInitialState = (): CanvasState => {
  const storedState = loadCanvasState();
  
  return {
    zoomLevel: storedState?.zoomLevel || 1,
    panX: storedState?.panX || 0,
    panY: storedState?.panY || 0,
    showGrid: storedState?.showGrid || false,
    gridSize: 20,
    isExporting: false,
    exportFormat: 'png',
    exportQuality: 2, // Device pixel ratio scaling
    autoFit: true,
    renderError: null,
    editMode: storedState?.editMode || false,
  };
};

const initialState = getInitialState();

export const useCanvasStore = create<CanvasStore>()(
  devtools(
    (set, get) => ({
      ...initialState,
      
      setZoom: (zoomLevel: number) => {
        const clampedZoom = Math.max(0.1, Math.min(3, zoomLevel));
        set({ zoomLevel: clampedZoom }, false, 'setZoom');
        // Save canvas state to localStorage
        const currentState = get();
        saveCanvasState({
          zoomLevel: currentState.zoomLevel,
          panX: currentState.panX,
          panY: currentState.panY,
          showGrid: currentState.showGrid,
          editMode: currentState.editMode,
        });
      },
      
      zoomIn: () => {
        const { zoomLevel } = get();
        const newZoom = Math.min(3, zoomLevel + 0.1);
        set({ zoomLevel: newZoom }, false, 'zoomIn');
      },
      
      zoomOut: () => {
        const { zoomLevel } = get();
        const newZoom = Math.max(0.1, zoomLevel - 0.1);
        set({ zoomLevel: newZoom }, false, 'zoomOut');
      },
      
      resetZoom: () => {
        set({ zoomLevel: 1 }, false, 'resetZoom');
      },
      
      setPan: (panX: number, panY: number) => {
        set({ panX, panY }, false, 'setPan');
        // Save canvas state to localStorage
        const currentState = get();
        saveCanvasState({
          zoomLevel: currentState.zoomLevel,
          panX: currentState.panX,
          panY: currentState.panY,
          showGrid: currentState.showGrid,
          editMode: currentState.editMode,
        });
      },
      
      resetPan: () => {
        set({ panX: 0, panY: 0 }, false, 'resetPan');
      },
      
      toggleGrid: () => {
        set((state) => ({ showGrid: !state.showGrid }), false, 'toggleGrid');
        // Save canvas state to localStorage
        const currentState = get();
        saveCanvasState({
          zoomLevel: currentState.zoomLevel,
          panX: currentState.panX,
          panY: currentState.panY,
          showGrid: currentState.showGrid,
          editMode: currentState.editMode,
        });
      },
      
      setGridSize: (gridSize: number) => {
        const clampedSize = Math.max(10, Math.min(50, gridSize));
        set({ gridSize: clampedSize }, false, 'setGridSize');
      },
      
      setExporting: (isExporting: boolean) => {
        set({ isExporting }, false, 'setExporting');
      },
      
      setExportFormat: (exportFormat: 'png' | 'jpg' | 'svg') => {
        set({ exportFormat }, false, 'setExportFormat');
      },
      
      setExportQuality: (exportQuality: number) => {
        const clampedQuality = Math.max(1, Math.min(4, exportQuality));
        set({ exportQuality: clampedQuality }, false, 'setExportQuality');
      },
      
      toggleAutoFit: () => {
        set((state) => ({ autoFit: !state.autoFit }), false, 'toggleAutoFit');
      },
      
      setRenderError: (error: string | null) => {
        set({ renderError: error }, false, 'setRenderError');
      },
      
      toggleEditMode: () => {
        set((state) => ({ editMode: !state.editMode }), false, 'toggleEditMode');
        // Save canvas state to localStorage
        const currentState = get();
        saveCanvasState({
          zoomLevel: currentState.zoomLevel,
          panX: currentState.panX,
          panY: currentState.panY,
          showGrid: currentState.showGrid,
          editMode: currentState.editMode,
        });
      },
      
      resetCanvas: () => {
        set({
          ...initialState,
          isExporting: false, // Keep export state as is
        }, false, 'resetCanvas');
      },
    }),
    {
      name: 'canvas-store',
    }
  )
);
