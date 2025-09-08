import React, { memo, useCallback, useRef } from 'react';
import { Header, ResizablePanels, HelpModal } from '@/components/common';
import { MonacoEditor, EditorToolbar, ErrorTerminal } from '@/components/editor';
import { MermaidCanvas, ExportModal, CanvasToolbar, ExportModalRef } from '@/components/canvas';
import { useEditorStore } from '@/store/editor-store';
import { useKeyboardShortcuts } from '@/hooks';

const MermaidDashboard: React.FC = memo(() => {
  const { 
    parsedErrors,
    showErrorTerminal,
    terminalHeight,
    toggleErrorTerminal,
    setTerminalHeight
  } = useEditorStore();
  const exportModalRef = useRef<ExportModalRef | null>(null);

  // Export handler
  const handleExport = useCallback(() => {
    exportModalRef.current?.downloadSvg();
  }, []);

  // AI Fix handler (placeholder for future implementation)
  const handleFixWithAI = useCallback(() => {
    console.log('Fix with AI clicked - Implementation coming soon!');
    // TODO: Implement AI error fixing functionality
  }, []);

  // Keyboard shortcuts
  useKeyboardShortcuts({
    onExportSVG: handleExport,
  });

  // Left panel - Code Editor
  const leftPanel = (
    <div className="h-full flex flex-col bg-white">
      {/* Editor Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
        <h2 className="text-sm font-medium text-gray-700">Code Editor</h2>
        <div className="flex items-center space-x-3">
          <EditorToolbar />
        </div>
      </div>
      
      
      {/* Monaco Editor */}
      <div className="flex-1 min-h-0">
        <MonacoEditor />
      </div>
      
      {/* Error Terminal */}
      <ErrorTerminal
        errors={parsedErrors}
        isVisible={showErrorTerminal}
        onToggle={toggleErrorTerminal}
        height={terminalHeight}
        onHeightChange={setTerminalHeight}
        onFixWithAI={handleFixWithAI}
      />
    </div>
  );

  // Right panel - Canvas
  const rightPanel = (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Canvas Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-white border-b border-gray-200">
        <h2 className="text-sm font-medium text-gray-700">Diagram Preview</h2>
        <div className="flex items-center space-x-4">
          <CanvasToolbar />
          {/* Separator */}
          <div className="w-px h-4 bg-gray-300" />
          {/* Export Modal */}
          <ExportModal ref={exportModalRef} />
          {/* Help Modal */}
          <HelpModal />
        </div>
      </div>
      
      
      {/* Mermaid Canvas */}
      <div className="flex-1 bg-white">
        <MermaidCanvas />
      </div>
    </div>
  );

  return (
    <div className="h-screen w-screen flex flex-col bg-white">
      {/* Header */}
      <Header className="flex-shrink-0" />
      
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <ResizablePanels
          leftPanel={leftPanel}
          rightPanel={rightPanel}
          defaultSplit={50}
          minSplit={25}
          maxSplit={75}
        />
      </div>
    </div>
  );
});

MermaidDashboard.displayName = 'MermaidDashboard';

export default MermaidDashboard;
