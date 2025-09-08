import React, { useState } from 'react';
import { HelpCircle, X, Keyboard } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HelpModalProps {
  className?: string;
}

const HelpModal: React.FC<HelpModalProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    { keys: ['Ctrl', 'Shift', 'P'], description: 'Export as PNG' },
    { keys: ['Ctrl', 'Shift', 'J'], description: 'Export as JPG' },
    { keys: ['Ctrl', '0'], description: 'Reset zoom to 100%' },
    { keys: ['Ctrl', 'Shift', 'G'], description: 'Toggle grid visibility' },
    { keys: ['Ctrl', 'Shift', 'W'], description: 'Toggle word wrap (in editor)' },
    { keys: ['Ctrl', 'Shift', 'L'], description: 'Toggle line numbers (in editor)' },
    { keys: ['Ctrl', 'Shift', 'R'], description: 'Reset editor (in editor)' },
  ];

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className={`flex items-center space-x-2 ${className}`}
      >
        <HelpCircle className="w-4 h-4" />
        <span>Help</span>
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-white/20 backdrop-blur-sm z-50" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center space-x-2">
                  <Keyboard className="w-5 h-5 text-gray-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Keyboard Shortcuts</h2>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="p-2"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              {/* Content */}
              <div className="p-6 overflow-y-auto">
                <div className="space-y-4">
                  {shortcuts.map((shortcut, index) => (
                    <div key={index} className="flex items-center justify-between py-2">
                      <span className="text-sm text-gray-700">{shortcut.description}</span>
                      <div className="flex items-center space-x-1">
                        {shortcut.keys.map((key, keyIndex) => (
                          <React.Fragment key={keyIndex}>
                            <kbd className="px-2 py-1 text-xs font-mono bg-gray-100 border border-gray-300 rounded">
                              {key}
                            </kbd>
                            {keyIndex < shortcut.keys.length - 1 && (
                              <span className="text-gray-400 text-xs">+</span>
                            )}
                          </React.Fragment>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-900 mb-2">Tips:</h3>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Use the template selector to get started quickly</li>
                    <li>• Drag the resize handle to adjust panel sizes</li>
                    <li>• Use the canvas toolbar to zoom and pan your diagrams</li>
                    <li>• Export your diagrams in PNG or JPG format</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default HelpModal;
