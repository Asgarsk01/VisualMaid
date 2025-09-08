/**
 * Local storage utilities for persisting editor state
 */

const STORAGE_KEYS = {
  MERMAID_CODE: 'visualmaid_mermaid_code',
  CANVAS_STATE: 'visualmaid_canvas_state',
  EDITOR_STATE: 'visualmaid_editor_state',
} as const;

export interface StoredCanvasState {
  zoomLevel: number;
  panX: number;
  panY: number;
  showGrid: boolean;
  editMode: boolean;
}

export interface StoredEditorState {
  theme: 'vs-dark' | 'vs-light';
  fontSize: number;
  wordWrap: boolean;
  lineNumbers: boolean;
  terminalHeight: number;
}

/**
 * Default Mermaid code for new users
 */
export const DEFAULT_MERMAID_CODE = `flowchart TD
    A[Welcome to VisualMaid] --> B[Start Creating]
    B --> C[Your First Diagram]
    C --> D[Edit & Customize]
    D --> E[Export & Share]
    
    style A fill:#e1f5fe
    style B fill:#f3e5f5
    style C fill:#e8f5e8
    style D fill:#fff3e0
    style E fill:#fce4ec`;

/**
 * Save Mermaid code to local storage
 */
export const saveMermaidCode = (code: string): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.MERMAID_CODE, code);
  } catch (error) {
    console.warn('Failed to save Mermaid code to localStorage:', error);
  }
};

/**
 * Load Mermaid code from local storage
 */
export const loadMermaidCode = (): string | null => {
  try {
    return localStorage.getItem(STORAGE_KEYS.MERMAID_CODE);
  } catch (error) {
    console.warn('Failed to load Mermaid code from localStorage:', error);
    return null;
  }
};

/**
 * Save canvas state to local storage
 */
export const saveCanvasState = (state: StoredCanvasState): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.CANVAS_STATE, JSON.stringify(state));
  } catch (error) {
    console.warn('Failed to save canvas state to localStorage:', error);
  }
};

/**
 * Load canvas state from local storage
 */
export const loadCanvasState = (): StoredCanvasState | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CANVAS_STATE);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.warn('Failed to load canvas state from localStorage:', error);
    return null;
  }
};

/**
 * Save editor state to local storage
 */
export const saveEditorState = (state: StoredEditorState): void => {
  try {
    localStorage.setItem(STORAGE_KEYS.EDITOR_STATE, JSON.stringify(state));
  } catch (error) {
    console.warn('Failed to save editor state to localStorage:', error);
  }
};

/**
 * Load editor state from local storage
 */
export const loadEditorState = (): StoredEditorState | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEYS.EDITOR_STATE);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.warn('Failed to load editor state from localStorage:', error);
    return null;
  }
};

/**
 * Clear all VisualMaid data from local storage
 */
export const clearVisualMaidStorage = (): void => {
  try {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  } catch (error) {
    console.warn('Failed to clear VisualMaid storage:', error);
  }
};

/**
 * Check if user has existing data (not default)
 */
export const hasExistingData = (): boolean => {
  const storedCode = loadMermaidCode();
  return storedCode !== null && storedCode !== DEFAULT_MERMAID_CODE;
};
