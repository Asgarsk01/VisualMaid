import React, { useRef, useCallback } from 'react';
import { AlertTriangle, ChevronUp, ChevronDown, GripHorizontal, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ErrorInfo {
  message: string;
  line?: number;
  column?: number;
  type: 'error' | 'warning';
}

interface ErrorTerminalProps {
  errors: ErrorInfo[];
  isVisible: boolean;
  onToggle: () => void;
  height: number;
  onHeightChange: (height: number) => void;
  onFixWithAI?: () => void;
  className?: string;
}

const ErrorTerminal: React.FC<ErrorTerminalProps> = ({
  errors,
  isVisible,
  onToggle,
  height,
  onHeightChange,
  onFixWithAI,
  className = ''
}) => {
  const resizeRef = useRef<HTMLDivElement>(null);
  const isResizingRef = useRef(false);
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);

  // Handle resize functionality - MUST be called before any early returns
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    isResizingRef.current = true;
    startYRef.current = e.clientY;
    startHeightRef.current = height;

    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizingRef.current) return;
      
      const deltaY = startYRef.current - e.clientY; // Inverted because we're resizing from top
      const newHeight = Math.max(100, Math.min(400, startHeightRef.current + deltaY));
      onHeightChange(newHeight);
    };

    const handleMouseUp = () => {
      isResizingRef.current = false;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [height, onHeightChange]);

  // Always render the terminal if user has toggled it open or if there are errors
  if (!isVisible && !errors.length) return null;

  return (
    <div className={`border-t border-gray-200 bg-gray-900 text-gray-100 flex-shrink-0 relative z-10 ${className}`}>
      {/* Resize Handle */}
      <div
        ref={resizeRef}
        onMouseDown={handleMouseDown}
        className="absolute top-0 left-0 right-0 h-1 bg-gray-600 hover:bg-gray-500 cursor-ns-resize flex items-center justify-center group"
      >
        <GripHorizontal className="w-3 h-3 text-gray-400 group-hover:text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>
      
      {/* Terminal Header */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700 mt-1">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 text-red-400" />
          <span className="text-sm font-medium">Problems</span>
          {errors.length > 0 && (
            <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full">
              {errors.length}
            </span>
          )}
        </div>
        <div className="flex items-center space-x-2">
          {/* Fix with AI Button */}
          {onFixWithAI && (
            <Button
              onClick={onFixWithAI}
              disabled={errors.length === 0}
              className={`h-7 px-3 text-xs font-medium border-0 shadow-sm transition-all duration-200 ${
                errors.length > 0
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white hover:shadow-md'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed opacity-50'
              }`}
            >
              <Sparkles className="w-3 h-3 mr-1.5" />
              Fix with AI
            </Button>
          )}
          
          {/* Toggle Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="h-6 w-6 p-0 text-gray-400 hover:text-gray-200"
          >
            {isVisible ? <ChevronDown className="w-3 h-3" /> : <ChevronUp className="w-3 h-3" />}
          </Button>
        </div>
      </div>

      {/* Terminal Content */}
      {isVisible && (
        <div 
          className="overflow-y-auto"
          style={{ height: `${height - 60}px` }} // Subtract header height
        >
          {errors.length === 0 ? (
            <div className="px-4 py-3 text-sm text-gray-400">
              No problems detected
            </div>
          ) : (
            <div className="space-y-1">
              {errors.map((error, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 px-4 py-2 hover:bg-gray-800 cursor-pointer"
                  onClick={() => {
                    // TODO: Jump to line in editor
                    console.log(`Jump to line ${error.line}`);
                  }}
                >
                  <div className="flex-shrink-0 mt-0.5">
                    {error.type === 'error' ? (
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-yellow-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-200">
                      {error.message}
                    </div>
                    {error.line && (
                      <div className="text-xs text-gray-400 mt-1">
                        Line {error.line}
                        {error.column && `, Column ${error.column}`}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ErrorTerminal;
