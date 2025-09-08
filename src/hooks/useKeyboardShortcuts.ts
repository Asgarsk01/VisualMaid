import { useEffect, useCallback } from 'react';
import { useEditorStore } from '@/store/editor-store';
import { useCanvasStore } from '@/store/canvas-store';

interface KeyboardShortcutsOptions {
  onExportSVG?: () => void;
  onResetZoom?: () => void;
  onToggleGrid?: () => void;
  onToggleWordWrap?: () => void;
  onToggleLineNumbers?: () => void;
  onResetEditor?: () => void;
}

export const useKeyboardShortcuts = (options: KeyboardShortcutsOptions = {}) => {
  const {
    onExportSVG,
    onResetZoom,
    onToggleGrid,
    onToggleWordWrap,
    onToggleLineNumbers,
    onResetEditor,
  } = options;

  const { toggleWordWrap, toggleLineNumbers, resetEditor } = useEditorStore();
  const { resetZoom, toggleGrid } = useCanvasStore();

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    // Check if we're in an input field or textarea
    const target = event.target as HTMLElement;
    const isInputField = target.tagName === 'INPUT' || 
                        target.tagName === 'TEXTAREA' || 
                        target.contentEditable === 'true' ||
                        target.closest('[contenteditable="true"]');

    // Only handle shortcuts when not in input fields (except for editor-specific shortcuts)
    if (isInputField && !target.closest('.monaco-editor')) {
      return;
    }

    const isCtrlOrCmd = event.ctrlKey || event.metaKey;
    const isShift = event.shiftKey;
    const isAlt = event.altKey;

    // Export shortcuts
    if (isCtrlOrCmd && isShift && event.key === 'S') {
      event.preventDefault();
      onExportSVG?.();
    }
    // Zoom shortcuts
    else if (isCtrlOrCmd && event.key === '0') {
      event.preventDefault();
      onResetZoom?.() || resetZoom();
    }
    // Grid toggle
    else if (isCtrlOrCmd && isShift && event.key === 'G') {
      event.preventDefault();
      onToggleGrid?.() || toggleGrid();
    }
    // Editor shortcuts (only when in editor)
    else if (target.closest('.monaco-editor')) {
      if (isCtrlOrCmd && isShift && event.key === 'W') {
        event.preventDefault();
        onToggleWordWrap?.() || toggleWordWrap();
      } else if (isCtrlOrCmd && isShift && event.key === 'L') {
        event.preventDefault();
        onToggleLineNumbers?.() || toggleLineNumbers();
      } else if (isCtrlOrCmd && isShift && event.key === 'R') {
        event.preventDefault();
        onResetEditor?.() || resetEditor();
      }
    }
  }, [
    onExportSVG,
    onResetZoom,
    onToggleGrid,
    onToggleWordWrap,
    onToggleLineNumbers,
    onResetEditor,
    toggleWordWrap,
    toggleLineNumbers,
    resetEditor,
    resetZoom,
    toggleGrid,
  ]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);
};

export default useKeyboardShortcuts;
