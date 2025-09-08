import React, { useCallback, forwardRef, useImperativeHandle } from 'react';
import { Download, Image, FileImage } from 'lucide-react';
import html2canvas from 'html2canvas';
import { saveAs } from 'file-saver';
import { useCanvasStore } from '@/store/canvas-store';
import { Button } from '@/components/ui/button';

interface ExportButtonsProps {
  className?: string;
}

export interface ExportButtonsRef {
  exportPNG: () => void;
  exportJPG: () => void;
}

const ExportButtons = forwardRef<ExportButtonsRef, ExportButtonsProps>(({ className = '' }, ref) => {
  const { 
    isExporting, 
    setExporting, 
    exportFormat, 
    setExportFormat, 
    exportQuality 
  } = useCanvasStore();

  // Export diagram as image
  const exportDiagram = useCallback(async (format: 'png' | 'jpg') => {
    setExporting(true);
    
    try {
      // Find the mermaid container
      const mermaidContainer = document.querySelector('.mermaid-container');
      const svgElement = mermaidContainer?.querySelector('svg');
      
      if (!svgElement) {
        throw new Error('No diagram to export');
      }

      // Get the SVG bounds
      const svgRect = svgElement.getBoundingClientRect();
      
      // Create a temporary container with white background
      const tempContainer = document.createElement('div');
      tempContainer.style.position = 'absolute';
      tempContainer.style.left = '-9999px';
      tempContainer.style.top = '-9999px';
      tempContainer.style.width = `${svgRect.width}px`;
      tempContainer.style.height = `${svgRect.height}px`;
      tempContainer.style.backgroundColor = '#ffffff';
      tempContainer.style.padding = '20px';
      tempContainer.style.boxSizing = 'border-box';
      
      // Clone the SVG
      const clonedSvg = svgElement.cloneNode(true) as SVGElement;
      clonedSvg.style.transform = 'none';
      clonedSvg.style.maxWidth = 'none';
      clonedSvg.style.maxHeight = 'none';
      
      tempContainer.appendChild(clonedSvg);
      document.body.appendChild(tempContainer);

      // Capture with html2canvas
      const canvas = await html2canvas(tempContainer, {
        backgroundColor: '#ffffff',
        scale: exportQuality,
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: svgRect.width + 40, // Add padding
        height: svgRect.height + 40, // Add padding
      });

      // Remove temporary container
      document.body.removeChild(tempContainer);

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
          const filename = `mermaid-diagram-${timestamp}.${format}`;
          saveAs(blob, filename);
        }
      }, `image/${format}`, format === 'jpg' ? 0.9 : undefined);

    } catch (error) {
      console.error('Export failed:', error);
      // You could add a toast notification here
      alert('Export failed. Please try again.');
    } finally {
      setExporting(false);
    }
  }, [exportQuality, setExporting]);

  // Export as PNG
  const handleExportPNG = useCallback(() => {
    setExportFormat('png');
    exportDiagram('png');
  }, [exportDiagram, setExportFormat]);

  // Export as JPG
  const handleExportJPG = useCallback(() => {
    setExportFormat('jpg');
    exportDiagram('jpg');
  }, [exportDiagram, setExportFormat]);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    exportPNG: handleExportPNG,
    exportJPG: handleExportJPG,
  }), [handleExportPNG, handleExportJPG]);

  return (
    <div className={`flex items-center space-x-1 ${className}`}>
      <Button
        onClick={handleExportPNG}
        disabled={isExporting}
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        title="Export as PNG"
      >
        <Image className="w-4 h-4" />
      </Button>
      
      <Button
        onClick={handleExportJPG}
        disabled={isExporting}
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0"
        title="Export as JPG"
      >
        <FileImage className="w-4 h-4" />
      </Button>
    </div>
  );
});

ExportButtons.displayName = 'ExportButtons';

export default ExportButtons;
