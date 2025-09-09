import React, { useState, useCallback, useRef, useEffect } from 'react';

interface ResizablePanelsProps {
  leftPanel: React.ReactNode;
  rightPanel: React.ReactNode;
  defaultSplit?: number; // Percentage for left panel (0-100)
  minSplit?: number;
  maxSplit?: number;
  className?: string;
}

const ResizablePanels: React.FC<ResizablePanelsProps> = ({
  leftPanel,
  rightPanel,
  defaultSplit = 50,
  minSplit = 20,
  maxSplit = 80,
  className = '',
}) => {
  const [splitPercentage, setSplitPercentage] = useState(defaultSplit);
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle mouse down on resize handle
  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    event.preventDefault();
    setIsDragging(true);
  }, []);

  // Handle mouse move during drag
  const handleMouseMove = useCallback((event: MouseEvent) => {
    if (!isDragging || !containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const containerWidth = containerRect.width;
    const mouseX = event.clientX - containerRect.left;
    
    const rawPercentage = (mouseX / containerWidth) * 100;
    const newSplitPercentage = Math.max(
      minSplit,
      Math.min(maxSplit, rawPercentage)
    );
    
    setSplitPercentage(newSplitPercentage);
  }, [isDragging, minSplit, maxSplit]);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Add global mouse event listeners
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
      };
    }
  }, [isDragging, handleMouseMove, handleMouseUp]);

  return (
    <div 
      ref={containerRef}
      className={`flex h-full w-full ${className}`}
    >
      {/* Left Panel */}
      <div 
        className="h-full overflow-hidden"
        style={{ width: `${splitPercentage}%` }}
      >
        {leftPanel}
      </div>
      
      {/* Resize Handle */}
      <div
        className={`
          w-1 bg-gray-200 hover:bg-gray-300 cursor-col-resize relative group transition-colors duration-200
          ${isDragging ? 'bg-blue-400' : ''}
        `}
        onMouseDown={handleMouseDown}
      >
        {/* Visual indicator */}
        <div className="absolute inset-y-0 left-1/2 transform -translate-x-1/2 w-3 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="w-0.5 h-8 bg-gray-400 rounded-full"></div>
        </div>
        
        {/* Expanded hover area */}
        <div className="absolute inset-y-0 -left-1 -right-1 cursor-col-resize"></div>
      </div>
      
      {/* Right Panel */}
      <div 
        className="h-full overflow-hidden"
        style={{ width: `${100 - splitPercentage}%` }}
      >
        {rightPanel}
      </div>
    </div>
  );
};

export default ResizablePanels;
