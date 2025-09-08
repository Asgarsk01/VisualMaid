import React, { useState } from 'react';
import { ChevronDown, FileText, GitBranch, Users, Database, PieChart, Activity } from 'lucide-react';
import { useEditorStore } from '@/store/editor-store';
import { Button } from '@/components/ui/button';

interface TemplateSelectorProps {
  className?: string;
}

// Sample diagrams for templates
const sampleDiagrams = {
  flowchart: `graph TD
    A[Start] --> B{Is it?}
    B -->|Yes| C[OK]
    C --> D[Rethink]
    D --> B
    B ---->|No| E[End]`,
  
  sequence: `sequenceDiagram
    participant Alice
    participant Bob
    Alice->>John: Hello John, how are you?
    loop Healthcheck
        John->>John: Fight against hypochondria
    end
    Note right of John: Rational thoughts <br/>prevail!
    John-->>Alice: Great!
    John->>Bob: How about you?
    Bob-->>John: Jolly good!`,
  
  class: `classDiagram
    class Animal {
        +String name
        +int age
        +eat()
        +sleep()
    }
    class Dog {
        +String breed
        +bark()
    }
    class Cat {
        +String color
        +meow()
    }
    Animal <|-- Dog
    Animal <|-- Cat`,
  
  state: `stateDiagram-v2
    [*] --> Still
    Still --> [*]
    Still --> Moving
    Moving --> Still
    Moving --> Crash
    Crash --> [*]`,
  
  pie: `pie title Pets adopted by volunteers
    "Dogs" : 386
    "Cats" : 85
    "Rats" : 15`,
};

const templateOptions = [
  {
    id: 'flowchart',
    name: 'Flowchart',
    icon: GitBranch,
    description: 'Process flow and decision trees',
  },
  {
    id: 'sequence',
    name: 'Sequence Diagram',
    icon: Users,
    description: 'User interactions and system flows',
  },
  {
    id: 'class',
    name: 'Class Diagram',
    icon: Database,
    description: 'Object-oriented class relationships',
  },
  {
    id: 'state',
    name: 'State Diagram',
    icon: Activity,
    description: 'State transitions and behaviors',
  },
  {
    id: 'pie',
    name: 'Pie Chart',
    icon: PieChart,
    description: 'Data visualization and statistics',
  },
];

const TemplateSelector: React.FC<TemplateSelectorProps> = ({ className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const { setCode } = useEditorStore();

  const handleTemplateSelect = (templateId: keyof typeof sampleDiagrams) => {
    setCode(sampleDiagrams[templateId]);
    setIsOpen(false);
  };

  return (
    <div className={`relative ${className}`}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2"
      >
        <FileText className="w-4 h-4" />
        <span>Templates</span>
        <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 z-10" 
            onClick={() => setIsOpen(false)}
          />
          
          {/* Dropdown */}
          <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-20">
            <div className="p-2">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Choose a Template</h3>
              <div className="space-y-1">
                {templateOptions.map((template) => {
                  const Icon = template.icon;
                  return (
                    <button
                      key={template.id}
                      onClick={() => handleTemplateSelect(template.id as keyof typeof sampleDiagrams)}
                      className="w-full flex items-start space-x-3 p-3 text-left hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Icon className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-900">
                          {template.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {template.description}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TemplateSelector;
