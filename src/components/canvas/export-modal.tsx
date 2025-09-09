import { useCallback, forwardRef, useImperativeHandle } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ExportModalProps {
  className?: string;
}

export interface ExportModalRef {
  downloadSvg: () => void;
}

const ExportModal = forwardRef<ExportModalRef, ExportModalProps>(({ className = '' }, ref) => {
  // Generate random filename
  const generateRandomFileName = useCallback(() => {
    const randomNum = Math.floor(Math.random() * 1000) + 1;
    return `diagram-${randomNum}`;
  }, []);

  // Direct SVG download function
  const downloadSvg = useCallback(() => {
    try {
      // Get the SVG element from mermaid container
      const mermaidContainer = document.querySelector('.mermaid-container');
      const svgElement = mermaidContainer?.querySelector('svg');
      
      if (!svgElement) {
        console.error('No SVG element found in mermaid container');
        return;
      }
      
      // Get SVG dimensions
      const svgBBox = (svgElement as SVGGraphicsElement).getBBox();
      const rect = svgElement.getBoundingClientRect();
      
      // Use the larger of the two dimensions to ensure we capture everything
      const svgWidth = Math.max(svgBBox.width, rect.width, svgElement.clientWidth, 800);
      const svgHeight = Math.max(svgBBox.height, rect.height, svgElement.clientHeight, 600);
      
      
      // Clone the SVG and prepare it for export
      const clonedSvg = svgElement.cloneNode(true) as SVGElement;
      
      // Reset all transforms and styling
      clonedSvg.style.transform = 'none';
      clonedSvg.style.maxWidth = 'none';
      clonedSvg.style.maxHeight = 'none';
      clonedSvg.style.width = `${svgWidth}px`;
      clonedSvg.style.height = `${svgHeight}px`;
      clonedSvg.style.display = 'block';
      clonedSvg.style.visibility = 'visible';
      
      // Set explicit dimensions on the SVG element
      clonedSvg.setAttribute('width', svgWidth.toString());
      clonedSvg.setAttribute('height', svgHeight.toString());
      
      // Ensure viewBox is set correctly
      if (!clonedSvg.getAttribute('viewBox') || clonedSvg.getAttribute('viewBox') === '0 0 0 0') {
        clonedSvg.setAttribute('viewBox', `0 0 ${svgWidth} ${svgHeight}`);
      }
      
      // Add white background rect
      const backgroundRect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
      backgroundRect.setAttribute('width', '100%');
      backgroundRect.setAttribute('height', '100%');
      backgroundRect.setAttribute('fill', '#ffffff');
      clonedSvg.insertBefore(backgroundRect, clonedSvg.firstChild);
      
      // Serialize SVG to string
      const serializer = new XMLSerializer();
      const svgString = serializer.serializeToString(clonedSvg);
      
      const completeSvgString = `
        <svg xmlns="http://www.w3.org/2000/svg" 
             width="${svgWidth + 80}" 
             height="${svgHeight + 80}" 
             viewBox="0 0 ${svgWidth + 80} ${svgHeight + 80}">
          <rect width="100%" height="100%" fill="#ffffff"/>
          <g transform="translate(40, 40)">
            ${svgString.replace(/<svg[^>]*>/, '').replace('</svg>', '')}
          </g>
        </svg>
      `;
      
      // Create and download SVG file
      const fileName = generateRandomFileName();
      const svgBlob = new Blob([completeSvgString], { type: 'image/svg+xml;charset=utf-8' });
      const downloadUrl = URL.createObjectURL(svgBlob);
      
      const link = document.createElement('a');
      link.download = `${fileName}.svg`;
      link.href = downloadUrl;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(downloadUrl);
      
      
    } catch (error) {
      console.error('SVG download error:', error);
    }
  }, [generateRandomFileName]);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    downloadSvg
  }), [downloadSvg]);

  return (
    <Button
      onClick={downloadSvg}
      className={`flex items-center space-x-2 ${className}`}
    >
      <Download className="w-4 h-4" />
      <span className="text-sm">Export SVG</span>
    </Button>
  );
});

ExportModal.displayName = 'ExportModal';

export default ExportModal;