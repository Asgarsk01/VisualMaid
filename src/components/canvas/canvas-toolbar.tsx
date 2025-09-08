import React from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Maximize, Grid, Minus, Plus, Move, Edit3 } from 'lucide-react';
import { useCanvasStore } from '@/store/canvas-store';
import { Button } from '@/components/ui/button';

interface CanvasToolbarProps {
  className?: string;
}

const CanvasToolbar: React.FC<CanvasToolbarProps> = ({ className = '' }) => {
  const {
    zoomLevel,
    showGrid,
    autoFit,
    editMode,
    zoomIn,
    zoomOut,
    resetZoom,
    resetPan,
    toggleGrid,
    toggleAutoFit,
    toggleEditMode,
  } = useCanvasStore();

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      {/* Zoom Controls - Clean Design */}
      <div className="flex items-center bg-gray-50 rounded-lg p-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={zoomOut}
          className="h-6 w-6 p-0 hover:bg-gray-200"
          title="Zoom Out"
        >
          <Minus className="w-3 h-3" />
        </Button>
        <div className="px-2 py-1 text-xs font-medium text-gray-700 min-w-[3rem] text-center">
          {Math.round(zoomLevel * 100)}%
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={zoomIn}
          className="h-6 w-6 p-0 hover:bg-gray-200"
          title="Zoom In"
        >
          <Plus className="w-3 h-3" />
        </Button>
      </div>

      {/* Separator */}
      <div className="w-px h-4 bg-gray-300" />

      {/* Control Buttons - Icon Only */}
      <div className="flex items-center space-x-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={resetZoom}
          className="h-8 w-8 p-0"
          title="Reset Zoom to 100%"
        >
          <RotateCcw className="w-4 h-4" />
        </Button>

        <Button
          variant={autoFit ? "default" : "ghost"}
          size="sm"
          onClick={toggleAutoFit}
          className="h-8 w-8 p-0"
          title="Auto Fit"
        >
          <Maximize className="w-4 h-4" />
        </Button>

        <Button
          variant={showGrid ? "default" : "ghost"}
          size="sm"
          onClick={toggleGrid}
          className="h-8 w-8 p-0"
          title="Toggle Grid"
        >
          <Grid className="w-4 h-4" />
        </Button>

        <Button
          variant="ghost"
          size="sm"
          onClick={resetPan}
          className="h-8 w-8 p-0"
          title="Center View"
        >
          <Move className="w-4 h-4" />
        </Button>

        <Button
          variant={editMode ? "default" : "ghost"}
          size="sm"
          onClick={toggleEditMode}
          className="h-8 w-8 p-0"
          title={editMode ? "Exit Edit Mode" : "Enter Edit Mode"}
        >
          <Edit3 className="w-4 h-4" />
        </Button>
      </div>

    </div>
  );
};

export default CanvasToolbar;
