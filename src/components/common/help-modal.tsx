import React, { useState } from 'react';
import { HelpCircle, X, BookOpen, Sparkles, Download, Eye, Code } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HelpModalProps {
  className?: string;
}

const HelpModal: React.FC<HelpModalProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);

  const mermaidExamples = [
    {
      title: 'Flowchart',
      code: `flowchart TD
    A[Start] --> B{Decision}
    B -->|Yes| C[Action 1]
    B -->|No| D[Action 2]
    C --> E[End]
    D --> E`,
      description: 'Create flowcharts with decision points and actions'
    },
    {
      title: 'Sequence Diagram',
      code: `sequenceDiagram
    participant A as User
    participant B as System
    A->>B: Request
    B-->>A: Response`,
      description: 'Show interactions between different entities'
    },
    {
      title: 'Class Diagram',
      code: `classDiagram
    class Animal {
        +String name
        +makeSound()
    }
    class Dog {
        +bark()
    }
    Animal <|-- Dog`,
      description: 'Model object-oriented relationships'
    }
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
                  <BookOpen className="w-5 h-5 text-gray-600" />
                  <h2 className="text-lg font-semibold text-gray-900">Mermaid Diagram Editor Help</h2>
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
              <div className="p-6 overflow-y-auto max-h-[60vh]">
                {/* Features Section */}
                <div className="mb-6">
                  <h3 className="text-md font-semibold text-gray-900 mb-3 flex items-center">
                    <Sparkles className="w-4 h-4 mr-2 text-blue-500" />
                    Key Features
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-start space-x-2">
                      <Code className="w-4 h-4 text-green-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">AI-Powered Fixes</p>
                        <p className="text-xs text-gray-600">Automatically fix syntax errors with AI assistance</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Eye className="w-4 h-4 text-blue-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Live Preview</p>
                        <p className="text-xs text-gray-600">See your diagram update in real-time</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <Download className="w-4 h-4 text-purple-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Export Options</p>
                        <p className="text-xs text-gray-600">Download as PNG or JPG formats</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-2">
                      <BookOpen className="w-4 h-4 text-orange-500 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">Templates</p>
                        <p className="text-xs text-gray-600">Start with pre-built diagram templates</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Mermaid Examples */}
                <div className="mb-6">
                  <h3 className="text-md font-semibold text-gray-900 mb-3">Common Diagram Types</h3>
                  <div className="space-y-4">
                    {mermaidExamples.map((example, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium text-gray-900">{example.title}</h4>
                          <span className="text-xs text-gray-500">{example.description}</span>
                        </div>
                        <pre className="text-xs bg-gray-50 p-3 rounded border overflow-x-auto">
                          <code>{example.code}</code>
                        </pre>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Quick Tips */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                    <Sparkles className="w-4 h-4 mr-2 text-blue-500" />
                    Quick Tips
                  </h3>
                  <ul className="text-sm text-gray-700 space-y-2">
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>Use the <strong>Fix with AI</strong> button when you see syntax errors in the terminal</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>Start with templates from the template selector for common diagram types</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>Use descriptive node names and labels to make your diagrams clear</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>Export your diagrams to share or save for later use</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-blue-500 mr-2">•</span>
                      <span>Check the terminal for detailed error messages and line numbers</span>
                    </li>
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
