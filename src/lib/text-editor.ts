/**
 * Text editing utilities for inline editing of Mermaid diagram elements
 */

export interface TextEditResult {
  newText: string;
  originalText: string;
  elementType: string;
  elementId?: string;
  elementIndex?: number;
}

/**
 * Makes a text element editable inline
 */
export const makeTextEditable = (
  element: HTMLElement,
  onSave: (result: TextEditResult) => void,
  onCancel: () => void
): void => {
  const originalText = element.textContent || '';
  const elementType = element.tagName.toLowerCase();
  const elementId = element.getAttribute('id') || undefined;
  
  // Get element index for better identification
  const parent = element.parentElement;
  const elementIndex = parent ? Array.from(parent.children).indexOf(element) : -1;

  // Create input element
  const input = document.createElement('input');
  input.type = 'text';
  input.value = originalText;
  input.className = 'inline-edit-input';
  input.style.cssText = `
    position: absolute;
    background: white;
    border: 2px solid #3b82f6;
    border-radius: 4px;
    padding: 4px 8px;
    font-size: inherit;
    font-family: inherit;
    color: inherit;
    min-width: 100px;
    z-index: 1000;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    outline: none;
  `;

  // Position the input relative to the viewport
  const rect = element.getBoundingClientRect();
  const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollY = window.pageYOffset || document.documentElement.scrollTop;
  
  input.style.left = `${rect.left + scrollX}px`;
  input.style.top = `${rect.top + scrollY}px`;
  input.style.width = `${Math.max(rect.width, 100)}px`;

  // Hide original element
  element.style.visibility = 'hidden';

  // Add input to document
  document.body.appendChild(input);
  input.focus();
  input.select();

  // Handle save
  const save = () => {
    const newText = input.value.trim();
    if (newText !== originalText && newText.length > 0) {
      onSave({
        newText,
        originalText,
        elementType,
        elementId,
        elementIndex
      });
    }
    cleanup();
  };

  // Handle cancel
  const cancel = () => {
    onCancel();
    cleanup();
  };

  // Cleanup function
  const cleanup = () => {
    element.style.visibility = 'visible';
    try {
      if (input && input.parentNode) {
        input.parentNode.removeChild(input);
      }
    } catch (error) {
      // Input might have already been removed, ignore the error
      console.warn('Input element cleanup error:', error);
    }
  };

  // Event listeners
  input.addEventListener('blur', save);
  input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      save();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancel();
    }
  });

  // Prevent clicks from bubbling
  input.addEventListener('click', (e) => {
    e.stopPropagation();
  });
};

/**
 * Updates Mermaid code based on text edit result
 */
export const updateMermaidCode = (
  originalCode: string,
  editResult: TextEditResult
): string => {
  const { newText, originalText, elementType } = editResult;
  
  // Escape special regex characters in the original text
  const escapedOriginalText = originalText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  
  let updatedCode = originalCode;
  
  // Handle different element types with better text replacement
  switch (elementType) {
    case 'text':
    case 'tspan':
      // For SVG text elements, look for the text in quotes or as direct content
      // Try multiple patterns to find the text
      const patterns = [
        // Text in quotes: "text"
        new RegExp(`"${escapedOriginalText}"`, 'g'),
        // Text in single quotes: 'text'
        new RegExp(`'${escapedOriginalText}'`, 'g'),
        // Text as direct content: >text<
        new RegExp(`>${escapedOriginalText}<`, 'g'),
        // Text with spaces around it
        new RegExp(`\\s${escapedOriginalText}\\s`, 'g'),
        // Text at the beginning of a line
        new RegExp(`^${escapedOriginalText}\\s`, 'gm'),
        // Text at the end of a line
        new RegExp(`\\s${escapedOriginalText}$`, 'gm'),
      ];
      
      for (const pattern of patterns) {
        if (pattern.test(updatedCode)) {
          updatedCode = updatedCode.replace(pattern, (match) => {
            // Preserve the surrounding characters (quotes, brackets, etc.)
            if (match.startsWith('"') && match.endsWith('"')) {
              return `"${newText}"`;
            } else if (match.startsWith("'") && match.endsWith("'")) {
              return `'${newText}'`;
            } else if (match.startsWith('>') && match.endsWith('<')) {
              return `>${newText}<`;
            } else if (match.startsWith(' ') && match.endsWith(' ')) {
              return ` ${newText} `;
            } else if (match.endsWith(' ')) {
              return `${newText} `;
            } else if (match.startsWith(' ')) {
              return ` ${newText}`;
            } else {
              return newText;
            }
          });
          break; // Only replace the first match
        }
      }
      break;
    
    default:
      // Generic text replacement - be more careful with word boundaries
      const genericPattern = new RegExp(`\\b${escapedOriginalText}\\b`, 'g');
      updatedCode = updatedCode.replace(genericPattern, newText);
  }
  
  return updatedCode;
};

/**
 * Adds click listeners to all text elements in a Mermaid diagram
 */
export const addTextEditListeners = (
  container: HTMLElement,
  onTextEdit: (result: TextEditResult) => void
): (() => void) => {
  const textElements: HTMLElement[] = [];
  
  // Find all text elements with more comprehensive selectors
  const selectors = [
    'text',           // SVG text elements
    'tspan',          // SVG text spans
    '.node-label',    // Node labels
    '.edge-label',    // Edge labels
    '[data-text]',    // Elements with data-text attribute
    '.label',         // Generic labels
    '.title',         // Titles
    'g text',         // Text within groups
    'g tspan',        // Text spans within groups
    'svg text',       // Text within SVG
    'svg tspan',      // Text spans within SVG
    '*[class*="text"]', // Any element with "text" in class name
    '*[class*="label"]', // Any element with "label" in class name
  ];
  
  selectors.forEach(selector => {
    try {
      const elements = container.querySelectorAll(selector);
      elements.forEach(element => {
        if (element instanceof HTMLElement && element.textContent?.trim()) {
          // Skip elements that are already being edited or are part of the UI
          if (!element.classList.contains('inline-edit-input') && 
              !element.closest('.inline-edit-input')) {
            textElements.push(element);
          }
        }
      });
    } catch (error) {
      console.warn(`Error querying selector "${selector}":`, error);
    }
  });
  
  // Fallback: Manual traversal if no elements found
  if (textElements.length === 0) {
    const traverseElement = (element: Element) => {
      if (element instanceof HTMLElement) {
        // Check if this element has text content
        if (element.textContent?.trim() && 
            element.children.length === 0 && // Leaf node with text
            !element.classList.contains('inline-edit-input')) {
          textElements.push(element);
        }
        
        // Recursively check children
        Array.from(element.children).forEach(traverseElement);
      }
    };
    
    traverseElement(container);
  }
  
  // Remove duplicates
  const uniqueElements = Array.from(new Set(textElements));
  
  // Add click listeners
  const clickHandlers: Array<{ element: HTMLElement; handler: (e: Event) => void }> = [];
  
  uniqueElements.forEach(element => {
    const handler = (e: Event) => {
      e.preventDefault();
      e.stopPropagation();
      
      makeTextEditable(
        element,
        (result) => {
          onTextEdit(result);
        },
        () => {
          // Text edit cancelled
        }
      );
    };
    
    element.addEventListener('click', handler, { capture: true });
    element.style.cursor = 'pointer';
    element.title = 'Click to edit';
    
    // Add visual feedback
    element.style.transition = 'opacity 0.2s ease';
    element.addEventListener('mouseenter', () => {
      element.style.opacity = '0.8';
    });
    element.addEventListener('mouseleave', () => {
      element.style.opacity = '1';
    });
    
    clickHandlers.push({ element, handler });
  });
  
  // Return cleanup function
  return () => {
    clickHandlers.forEach(({ element, handler }) => {
      element.removeEventListener('click', handler, { capture: true });
      element.style.cursor = '';
      element.style.opacity = '';
      element.style.transition = '';
      element.title = '';
    });
  };
};
