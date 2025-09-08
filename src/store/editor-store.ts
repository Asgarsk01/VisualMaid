import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { 
  DEFAULT_MERMAID_CODE, 
  saveMermaidCode, 
  loadMermaidCode, 
  saveEditorState, 
  loadEditorState,
  hasExistingData 
} from '@/lib/storage';

export interface EditorState {
  code: string;
  isValid: boolean;
  errorMessage: string | null;
  parsedErrors: Array<{
    message: string;
    line?: number;
    column?: number;
    type: 'error' | 'warning';
  }>;
  showErrorTerminal: boolean;
  userClosedTerminal: boolean;
  terminalHeight: number;
  theme: 'vs-dark' | 'vs-light';
  fontSize: number;
  wordWrap: boolean;
  lineNumbers: boolean;
  isDefaultCode: boolean;
}

export interface EditorActions {
  setCode: (code: string) => void;
  setValidation: (isValid: boolean, errorMessage?: string | null) => void;
  setParsedErrors: (errors: Array<{
    message: string;
    line?: number;
    column?: number;
    type: 'error' | 'warning';
  }>) => void;
  toggleErrorTerminal: () => void;
  closeErrorTerminal: () => void;
  setTerminalHeight: (height: number) => void;
  setTheme: (theme: 'vs-dark' | 'vs-light') => void;
  setFontSize: (fontSize: number) => void;
  toggleWordWrap: () => void;
  toggleLineNumbers: () => void;
  resetEditor: () => void;
  clearSession: () => void;
}

export type EditorStore = EditorState & EditorActions;

// Initialize with default or stored values
const getInitialState = (): EditorState => {
  const storedCode = loadMermaidCode();
  const storedEditorState = loadEditorState();
  const hasExisting = hasExistingData();
  
  return {
    code: storedCode || DEFAULT_MERMAID_CODE,
    isValid: true,
    errorMessage: null,
    parsedErrors: [],
    showErrorTerminal: false,
    userClosedTerminal: false,
    terminalHeight: storedEditorState?.terminalHeight || 200,
    theme: storedEditorState?.theme || 'vs-light',
    fontSize: storedEditorState?.fontSize || 14,
    wordWrap: storedEditorState?.wordWrap ?? true,
    lineNumbers: storedEditorState?.lineNumbers ?? true,
    isDefaultCode: !hasExisting,
  };
};

const initialState = getInitialState();

export const useEditorStore = create<EditorStore>()(
  devtools(
    (set, get) => ({
      ...initialState,
      
      setCode: (code: string) => {
        const currentState = get();
        const isDefault = code === DEFAULT_MERMAID_CODE;
        
        set({ 
          code, 
          isDefaultCode: isDefault 
        }, false, 'setCode');
        
        // Save to localStorage
        saveMermaidCode(code);
      },
      
      setValidation: (isValid: boolean, errorMessage?: string | null) => {
        set({ 
          isValid, 
          errorMessage: errorMessage ?? null 
        }, false, 'setValidation');
      },
      
      setParsedErrors: (parsedErrors) => {
        set((state) => ({
          parsedErrors,
          // Auto-show terminal when errors occur, unless user manually closed it
          showErrorTerminal: parsedErrors.length > 0 && !state.userClosedTerminal
        }), false, 'setParsedErrors');
      },
      
      toggleErrorTerminal: () => {
        set((state) => ({ 
          showErrorTerminal: !state.showErrorTerminal,
          userClosedTerminal: state.showErrorTerminal // If closing, mark as user closed
        }), false, 'toggleErrorTerminal');
      },
      
      closeErrorTerminal: () => {
        set({ 
          showErrorTerminal: false,
          userClosedTerminal: true
        }, false, 'closeErrorTerminal');
      },
      
      setTerminalHeight: (terminalHeight) => {
        set({ terminalHeight }, false, 'setTerminalHeight');
        // Save editor state to localStorage
        const currentState = get();
        saveEditorState({
          theme: currentState.theme,
          fontSize: currentState.fontSize,
          wordWrap: currentState.wordWrap,
          lineNumbers: currentState.lineNumbers,
          terminalHeight: currentState.terminalHeight,
        });
      },
      
      setTheme: (theme: 'vs-dark' | 'vs-light') => {
        set({ theme }, false, 'setTheme');
        // Save editor state to localStorage
        const currentState = get();
        saveEditorState({
          theme: currentState.theme,
          fontSize: currentState.fontSize,
          wordWrap: currentState.wordWrap,
          lineNumbers: currentState.lineNumbers,
          terminalHeight: currentState.terminalHeight,
        });
      },
      
      setFontSize: (fontSize: number) => {
        set({ fontSize }, false, 'setFontSize');
        // Save editor state to localStorage
        const currentState = get();
        saveEditorState({
          theme: currentState.theme,
          fontSize: currentState.fontSize,
          wordWrap: currentState.wordWrap,
          lineNumbers: currentState.lineNumbers,
          terminalHeight: currentState.terminalHeight,
        });
      },
      
      toggleWordWrap: () => {
        set((state) => ({ wordWrap: !state.wordWrap }), false, 'toggleWordWrap');
        // Save editor state to localStorage
        const currentState = get();
        saveEditorState({
          theme: currentState.theme,
          fontSize: currentState.fontSize,
          wordWrap: currentState.wordWrap,
          lineNumbers: currentState.lineNumbers,
          terminalHeight: currentState.terminalHeight,
        });
      },
      
      toggleLineNumbers: () => {
        set((state) => ({ lineNumbers: !state.lineNumbers }), false, 'toggleLineNumbers');
        // Save editor state to localStorage
        const currentState = get();
        saveEditorState({
          theme: currentState.theme,
          fontSize: currentState.fontSize,
          wordWrap: currentState.wordWrap,
          lineNumbers: currentState.lineNumbers,
          terminalHeight: currentState.terminalHeight,
        });
      },
      
      resetEditor: () => {
        set(initialState, false, 'resetEditor');
      },
      
      clearSession: () => {
        // Clear localStorage
        const { clearVisualMaidStorage } = require('@/lib/storage');
        clearVisualMaidStorage();
        
        // Reset to default state
        set({
          ...initialState,
          code: DEFAULT_MERMAID_CODE,
          isDefaultCode: true,
        }, false, 'clearSession');
      },
    }),
    {
      name: 'editor-store',
    }
  )
);
