import React, { useEffect, useRef, useCallback, memo } from 'react';
import mermaid from 'mermaid';
import { useEditorStore } from '@/store/editor-store';
import { useCanvasStore } from '@/store/canvas-store';
import { AlertCircle, Edit3 } from 'lucide-react';
import { defaultMermaidConfig, generateMermaidId } from '@/lib/mermaid-utils';
import { addTextEditListeners, updateMermaidCode } from '@/lib/text-editor';
import { parseMermaidError, detectSyntaxErrors } from '@/lib/error-parser';

interface MermaidCanvasProps {
  className?: string;
}

const MermaidCanvas: React.FC<MermaidCanvasProps> = memo(({ className = '' }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<HTMLDivElement>(null);
  const renderTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isDraggingRef = useRef(false);
  const lastPanPointRef = useRef({ x: 0, y: 0 });
  const lastTouchDistanceRef = useRef(0);
  const textEditCleanupRef = useRef<(() => void) | null>(null);
  const dragStartTimeRef = useRef(0);
  
  const { code, setCode, setValidation, setParsedErrors } = useEditorStore();
  const { 
    zoomLevel, 
    panX, 
    panY, 
    autoFit,
    showGrid,
    editMode,
    setRenderError,
    renderError,
    setZoom,
    setPan
  } = useCanvasStore();

  // Initialize Mermaid
  useEffect(() => {
    mermaid.initialize(defaultMermaidConfig);
  }, []);

  // Render Mermaid diagram
  const renderDiagram = useCallback(async () => {
    if (!svgRef.current || !code.trim()) {
      setRenderError(null);
      setValidation(true, null);
      return;
    }

    try {
      // Clear previous content
      svgRef.current.innerHTML = '';
      
      // Generate unique ID for this render
      const id = generateMermaidId();
      
      // Validate and render the diagram
      const { svg } = await mermaid.render(id, code);
      
      // Insert the SVG
      svgRef.current.innerHTML = svg;
      
      // Apply zoom and pan transformations
      const svgElement = svgRef.current.querySelector('svg');
      if (svgElement) {
        svgElement.style.transform = `scale(${zoomLevel}) translate(${panX}px, ${panY}px)`;
        svgElement.style.transformOrigin = 'center center';
        svgElement.style.transition = 'transform 0.2s ease-out';
        
        // Auto-fit if enabled
        if (autoFit && containerRef.current) {
          const containerRect = containerRef.current.getBoundingClientRect();
          const svgRect = svgElement.getBoundingClientRect();
          
          if (svgRect.width > 0 && svgRect.height > 0) {
            const scaleX = (containerRect.width - 40) / svgRect.width;
            const scaleY = (containerRect.height - 40) / svgRect.height;
            const autoScale = Math.min(scaleX, scaleY, 1);
            
            if (autoScale < 1) {
              svgElement.style.transform = `scale(${autoScale}) translate(${panX}px, ${panY}px)`;
            }
          }
        }
        
        // Add text editing listeners only if edit mode is enabled
        if (textEditCleanupRef.current) {
          textEditCleanupRef.current();
        }
         if (editMode) {
           // Longer delay to ensure SVG is fully rendered
           setTimeout(() => {
             if (svgRef.current) {
               textEditCleanupRef.current = addTextEditListeners(svgRef.current, handleTextEdit);
             }
           }, 500);
         }
      }
      
      // Clear any previous errors
      setRenderError(null);
      setValidation(true, null);
      setParsedErrors([]);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to render diagram';
      setRenderError(errorMessage);
      setValidation(false, errorMessage);
      
      // Parse the error for detailed information
      const mermaidErrors = parseMermaidError(errorMessage);
      
      // Also detect syntax errors manually
      const syntaxErrors = detectSyntaxErrors(code);
      
      // Combine both types of errors, avoiding duplicates
      const allErrors = [...mermaidErrors];
      for (const syntaxError of syntaxErrors) {
        // Check if we already have an error for this line
        const existingError = allErrors.find(e => e.line === syntaxError.line);
        if (!existingError) {
          allErrors.push(syntaxError);
        }
      }
      
      setParsedErrors(allErrors);
      
      // Show simple error message in the canvas
      if (svgRef.current) {
        svgRef.current.innerHTML = `
          <div class="flex items-center justify-center h-full text-gray-500">
            <div class="text-center p-8">
              <div class="flex justify-center mb-4">
                <svg class="w-12 h-12" fill="currentColor" viewBox="0 0 20 20">
                  <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </div>
              <h3 class="text-lg font-semibold mb-2 text-gray-700">Diagram Error</h3>
              <p class="text-sm text-gray-500">Check the Problems panel below for detailed error information.</p>
            </div>
          </div>
        `;
      }
    }
  }, [code, zoomLevel, panX, panY, autoFit, setRenderError, setValidation, setParsedErrors]);

  // Debounced render effect
  useEffect(() => {
    if (renderTimeoutRef.current) {
      clearTimeout(renderTimeoutRef.current);
    }
    
    renderTimeoutRef.current = setTimeout(() => {
      renderDiagram();
    }, 300); // 300ms debounce
    
    return () => {
      if (renderTimeoutRef.current) {
        clearTimeout(renderTimeoutRef.current);
      }
    };
  }, [renderDiagram]);

  // Calculate distance between two touch points
  const getTouchDistance = useCallback((touches: React.TouchList) => {
    if (touches.length < 2) return 0;
    const touch1 = touches[0];
    const touch2 = touches[1];
    const dx = touch1.clientX - touch2.clientX;
    const dy = touch1.clientY - touch2.clientY;
    return Math.sqrt(dx * dx + dy * dy);
  }, []);

  // Get center point between two touches
  const getTouchCenter = useCallback((touches: React.TouchList) => {
    if (touches.length < 2) return { x: 0, y: 0 };
    const touch1 = touches[0];
    const touch2 = touches[1];
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2
    };
  }, []);

  // Handle mouse wheel zoom
  const handleWheel = useCallback((event: React.WheelEvent) => {
    // Don't zoom if in edit mode
    if (editMode) return;
    
    // Only handle wheel events when not dragging and after a small delay from drag start
    if (isDraggingRef.current || (Date.now() - dragStartTimeRef.current) < 100) return;
    
    // Note: preventDefault is not available in passive event listeners for wheel events
    // We'll handle the zoom without preventing default
    
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Get mouse position relative to container
    const mouseX = event.clientX - rect.left;
    const mouseY = event.clientY - rect.top;
    
    // Calculate zoom factor
    const zoomFactor = event.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.1, Math.min(3, zoomLevel * zoomFactor));
    
    // Calculate new pan to zoom towards mouse position
    const zoomRatio = newZoom / zoomLevel;
    const newPanX = panX + (centerX - mouseX) * (1 - zoomRatio);
    const newPanY = panY + (centerY - mouseY) * (1 - zoomRatio);
    
    setZoom(newZoom);
    setPan(newPanX, newPanY);
  }, [editMode, zoomLevel, panX, panY, setZoom, setPan]);

  // Handle mouse down for panning
  const handleMouseDown = useCallback((event: React.MouseEvent) => {
    // Don't start panning if in edit mode
    if (editMode) return;
    
    if (event.button === 0) { // Left mouse button
      isDraggingRef.current = true;
      dragStartTimeRef.current = Date.now();
      lastPanPointRef.current = { x: event.clientX, y: event.clientY };
      event.preventDefault();
      event.stopPropagation();
    }
  }, [editMode]);

  // Handle mouse move for panning
  const handleMouseMove = useCallback((event: React.MouseEvent) => {
    if (isDraggingRef.current) {
      event.preventDefault();
      event.stopPropagation();
      
      const deltaX = event.clientX - lastPanPointRef.current.x;
      const deltaY = event.clientY - lastPanPointRef.current.y;
      
      setPan(panX + deltaX, panY + deltaY);
      lastPanPointRef.current = { x: event.clientX, y: event.clientY };
    }
  }, [panX, panY, setPan]);

  // Handle mouse up
  const handleMouseUp = useCallback(() => {
    isDraggingRef.current = false;
  }, []);

  // Handle touch start for pinch zoom and pan
  const handleTouchStart = useCallback((event: React.TouchEvent) => {
    event.preventDefault();
    
    if (event.touches.length === 2) {
      // Two finger touch - prepare for pinch zoom
      lastTouchDistanceRef.current = getTouchDistance(event.touches);
    } else if (event.touches.length === 1) {
      // Single finger touch - prepare for panning
      isDraggingRef.current = true;
      lastPanPointRef.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    }
  }, [getTouchDistance]);

  // Handle touch move for pinch zoom and pan
  const handleTouchMove = useCallback((event: React.TouchEvent) => {
    event.preventDefault();
    
    if (event.touches.length === 2) {
      // Two finger touch - pinch zoom
      const currentDistance = getTouchDistance(event.touches);
      if (lastTouchDistanceRef.current > 0) {
        const zoomFactor = currentDistance / lastTouchDistanceRef.current;
        const newZoom = Math.max(0.1, Math.min(3, zoomLevel * zoomFactor));
        
        // Get center point for zoom
        const center = getTouchCenter(event.touches);
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          const touchX = center.x - rect.left;
          const touchY = center.y - rect.top;
          
          // Calculate new pan to zoom towards touch center
          const zoomRatio = newZoom / zoomLevel;
          const newPanX = panX + (centerX - touchX) * (1 - zoomRatio);
          const newPanY = panY + (centerY - touchY) * (1 - zoomRatio);
          
          setZoom(newZoom);
          setPan(newPanX, newPanY);
        }
      }
      lastTouchDistanceRef.current = currentDistance;
    } else if (event.touches.length === 1 && isDraggingRef.current) {
      // Single finger touch - panning
      const deltaX = event.touches[0].clientX - lastPanPointRef.current.x;
      const deltaY = event.touches[0].clientY - lastPanPointRef.current.y;
      
      setPan(panX + deltaX, panY + deltaY);
      lastPanPointRef.current = { x: event.touches[0].clientX, y: event.touches[0].clientY };
    }
  }, [zoomLevel, panX, panY, setZoom, setPan, getTouchDistance, getTouchCenter]);

  // Handle touch end
  const handleTouchEnd = useCallback(() => {
    isDraggingRef.current = false;
    lastTouchDistanceRef.current = 0;
  }, []);

  // Handle text editing
  const handleTextEdit = useCallback((result: any) => {
    const updatedCode = updateMermaidCode(code, result);
    setCode(updatedCode);
  }, [code, setCode]);

  // Add global mouse event listeners for panning
  useEffect(() => {
    const handleGlobalMouseMove = (event: MouseEvent) => {
      if (isDraggingRef.current) {
        event.preventDefault();
        const deltaX = event.clientX - lastPanPointRef.current.x;
        const deltaY = event.clientY - lastPanPointRef.current.y;
        
        setPan(panX + deltaX, panY + deltaY);
        lastPanPointRef.current = { x: event.clientX, y: event.clientY };
      }
    };

    const handleGlobalMouseUp = (event: MouseEvent) => {
      if (isDraggingRef.current) {
        event.preventDefault();
        isDraggingRef.current = false;
      }
    };

    // Always add listeners to handle dragging outside the container
    document.addEventListener('mousemove', handleGlobalMouseMove, { passive: false });
    document.addEventListener('mouseup', handleGlobalMouseUp, { passive: false });

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [panX, panY, setPan]);

  // Handle edit mode changes
  useEffect(() => {
    if (svgRef.current) {
      // Clean up existing listeners
      if (textEditCleanupRef.current) {
        textEditCleanupRef.current();
        textEditCleanupRef.current = null;
      }
      
       // Add new listeners if edit mode is enabled
       if (editMode) {
         // Longer delay to ensure SVG is fully rendered
         setTimeout(() => {
           if (svgRef.current) {
             textEditCleanupRef.current = addTextEditListeners(svgRef.current, handleTextEdit);
           }
         }, 500);
       }
    }
  }, [editMode, handleTextEdit]);

  // Cleanup text editing listeners on unmount
  useEffect(() => {
    return () => {
      if (textEditCleanupRef.current) {
        textEditCleanupRef.current();
      }
    };
  }, []);

  return (
    <div 
      ref={containerRef}
      className={`h-full w-full overflow-hidden relative bg-white ${
        editMode 
          ? 'cursor-text' 
          : 'cursor-grab active:cursor-grabbing'
      } ${className}`}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      style={{ 
        touchAction: 'none',
        backgroundImage: showGrid ? `
          linear-gradient(rgba(0,0,0,.1) 1px, transparent 1px),
          linear-gradient(90deg, rgba(0,0,0,.1) 1px, transparent 1px)
        ` : 'none',
        backgroundSize: '20px 20px'
      }}
    >
      {/* Edit Mode Indicator */}
      {editMode && (
        <div className="absolute top-2 left-2 z-10 bg-blue-500 text-white px-3 py-2 rounded-md text-xs font-medium shadow-sm">
          <div className="flex items-center space-x-2">
            <Edit3 className="w-3 h-3" />
            <span>Edit Mode - Click any text to edit</span>
          </div>
        </div>
      )}

      {/* Canvas content */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div 
          ref={svgRef}
          className="mermaid-container max-w-full max-h-full"
          style={{
            transform: `scale(${zoomLevel}) translate(${panX}px, ${panY}px)`,
            transformOrigin: 'center center',
            transition: 'transform 0.2s ease-out',
          }}
        />
      </div>
      
      {/* Empty state */}
      {!code.trim() && !renderError && (
        <div className="absolute inset-0 flex items-center justify-center text-gray-400">
          <div className="text-center">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-lg font-medium mb-2">Start Creating</h3>
            <p className="text-sm">Enter Mermaid code in the editor to see your diagram here</p>
          </div>
        </div>
      )}
      
      {/* Render error overlay */}
      {renderError && (
        <div className="absolute inset-0 flex items-center justify-center bg-red-50 border-2 border-red-200 rounded-lg m-4">
          <div className="text-center p-8 max-w-md">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-700 mb-2">Diagram Error</h3>
            <p className="text-sm text-red-600 bg-red-100 p-3 rounded border border-red-200 font-mono text-left">
              {renderError}
            </p>
          </div>
        </div>
      )}
    </div>
  );
});

MermaidCanvas.displayName = 'MermaidCanvas';

export default MermaidCanvas;
