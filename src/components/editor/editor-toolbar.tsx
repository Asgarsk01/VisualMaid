import React from 'react';
import { RotateCcw, WrapText, Hash, Minus, Plus, AlertTriangle } from 'lucide-react';
import { useEditorStore } from '@/store/editor-store';
import { Button } from '@/components/ui/button';

interface EditorToolbarProps {
  className?: string;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({ className = '' }) => {
  const {
    fontSize,
    wordWrap,
    lineNumbers,
    parsedErrors,
    showErrorTerminal,
    setFontSize,
    toggleWordWrap,
    toggleLineNumbers,
    toggleErrorTerminal,
    resetEditor,
  } = useEditorStore();

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Font Size Controls - Match Canvas Toolbar Style */}
      <div className="flex items-center bg-gray-50 rounded-lg p-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setFontSize(Math.max(10, fontSize - 1))}
          className="h-6 w-6 p-0 hover:bg-gray-200"
          title="Decrease font size"
        >
          <Minus className="w-3 h-3" />
        </Button>
        <div className="px-2 py-1 text-xs font-medium text-gray-700 min-w-[2rem] text-center">
          {fontSize}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setFontSize(Math.min(24, fontSize + 1))}
          className="h-6 w-6 p-0 hover:bg-gray-200"
          title="Increase font size"
        >
          <Plus className="w-3 h-3" />
        </Button>
      </div>

      {/* Separator */}
      <div className="w-px h-4 bg-gray-300" />

      {/* Toggle Buttons - Icon Only */}
      <div className="flex items-center space-x-1">
        <Button
          variant={wordWrap ? "default" : "ghost"}
          size="sm"
          onClick={toggleWordWrap}
          className="h-8 w-8 p-0"
          title="Toggle Word Wrap"
        >
          <WrapText className="w-4 h-4" />
        </Button>

        <Button
          variant={lineNumbers ? "default" : "ghost"}
          size="sm"
          onClick={toggleLineNumbers}
          className="h-8 w-8 p-0"
          title="Toggle Line Numbers"
        >
          <Hash className="w-4 h-4" />
        </Button>

      </div>

      {/* Separator */}
      <div className="w-px h-4 bg-gray-300" />

      {/* Reset Button - Icon Only */}
      <Button
        variant="ghost"
        size="sm"
        onClick={resetEditor}
        className="h-8 w-8 p-0"
        title="Reset Editor"
      >
        <RotateCcw className="w-4 h-4" />
      </Button>

      {/* Separator */}
      <div className="w-px h-4 bg-gray-300" />

      {/* Error Terminal Toggle */}
      <div className="relative">
        <Button
          variant={showErrorTerminal ? "default" : "ghost"}
          size="sm"
          onClick={toggleErrorTerminal}
          className="h-8 w-8 p-0"
          title={showErrorTerminal ? "Hide Problems" : "Show Problems"}
        >
          <AlertTriangle className="w-4 h-4" />
        </Button>
        {parsedErrors.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
            {parsedErrors.length}
          </span>
        )}
      </div>
    </div>
  );
};

export default EditorToolbar;
