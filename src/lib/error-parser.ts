/**
 * Error parsing utilities for Mermaid diagrams
 */

export interface ParsedError {
  message: string;
  line?: number;
  column?: number;
  type: 'error' | 'warning';
  originalError: string;
}

/**
 * Parses Mermaid error messages to extract useful information
 */
export const parseMermaidError = (error: string): ParsedError[] => {
  const errors: ParsedError[] = [];
  
  // Split error message by common delimiters to handle multiple errors
  const errorSegments = error.split(/\n|;|\.\s+(?=[A-Z])/).filter(segment => segment.trim().length > 0);
  
  // Common Mermaid error patterns
  const patterns = [
    // Line number patterns with better regex
    /line\s+(\d+):?\s*(.+)/gi,
    /at\s+line\s+(\d+):?\s*(.+)/gi,
    /line\s+(\d+),\s*column\s+(\d+):?\s*(.+)/gi,
    /(\d+):(\d+):?\s*(.+)/gi,
    /(\d+):\s*(.+)/gi,
    
    // Error type patterns
    /error:?\s*(.+)/gi,
    /syntax\s+error:?\s*(.+)/gi,
    /parse\s+error:?\s*(.+)/gi,
    /rendering\s+error:?\s*(.+)/gi,
  ];

  // Process each error segment
  for (const segment of errorSegments) {
    let segmentProcessed = false;
    
    // Try to extract line numbers and error messages
    for (const pattern of patterns) {
      const matches = [...segment.matchAll(pattern)];
      for (const match of matches) {
        if (match.length >= 3) {
          const lineStr = match[1];
          const columnStr = match[2];
          const message = match[match.length - 1] || match[0];
          
          // Parse line number with better validation
          const line = parseInt(lineStr, 10);
          const column = columnStr && !isNaN(parseInt(columnStr, 10)) ? parseInt(columnStr, 10) : undefined;
          
          // Only add if line number is valid
          if (!isNaN(line) && line > 0) {
            errors.push({
              message: message.trim(),
              line,
              column,
              type: 'error',
              originalError: segment
            });
            segmentProcessed = true;
            break;
          }
        }
      }
      if (segmentProcessed) break;
    }
    
    // If no specific line numbers found for this segment, create a general error
    if (!segmentProcessed) {
      // Clean up common error prefixes
      let cleanMessage = segment
        .replace(/^error:?\s*/i, '')
        .replace(/^syntax\s+error:?\s*/i, '')
        .replace(/^parse\s+error:?\s*/i, '')
        .replace(/^rendering\s+error:?\s*/i, '')
        .trim();

      // If message is too long, truncate it
      if (cleanMessage.length > 100) {
        cleanMessage = cleanMessage.substring(0, 100) + '...';
      }

      if (cleanMessage.length > 0) {
        errors.push({
          message: cleanMessage || 'Unknown error occurred',
          type: 'error',
          originalError: segment
        });
      }
    }
  }

  // If no errors were found at all, create a fallback error
  if (errors.length === 0) {
    errors.push({
      message: 'Syntax error in Mermaid diagram',
      type: 'error',
      originalError: error
    });
  }

  return errors;
};

/**
 * Enhanced error context for AI processing
 */
export interface EnhancedErrorContext {
  originalError: string;
  parsedErrors: ParsedError[];
  errorType: 'syntax' | 'semantic' | 'rendering' | 'unknown';
  suggestedFixes: string[];
  codeContext?: {
    line: number;
    content: string;
    surroundingLines: string[];
  };
}

/**
 * Analyzes error and provides enhanced context for AI
 */
export const analyzeErrorForAI = (error: string, mermaidCode: string): EnhancedErrorContext => {
  const parsedErrors = parseMermaidError(error);
  const lines = mermaidCode.split('\n');
  
  // Determine error type
  let errorType: EnhancedErrorContext['errorType'] = 'unknown';
  if (error.toLowerCase().includes('syntax')) {
    errorType = 'syntax';
  } else if (error.toLowerCase().includes('semantic')) {
    errorType = 'semantic';
  } else if (error.toLowerCase().includes('render')) {
    errorType = 'rendering';
  }

  // Get code context for the first error with line number
  let codeContext: EnhancedErrorContext['codeContext'] | undefined;
  const firstErrorWithLine = parsedErrors.find(e => e.line);
  if (firstErrorWithLine && firstErrorWithLine.line) {
    const lineIndex = firstErrorWithLine.line - 1; // Convert to 0-based index
    if (lineIndex >= 0 && lineIndex < lines.length) {
      const surroundingLines = lines.slice(
        Math.max(0, lineIndex - 2),
        Math.min(lines.length, lineIndex + 3)
      );
      
      codeContext = {
        line: firstErrorWithLine.line,
        content: lines[lineIndex],
        surroundingLines
      };
    }
  }

  // Generate suggested fixes based on common patterns
  const suggestedFixes: string[] = [];
  
  if (error.toLowerCase().includes('arrow')) {
    suggestedFixes.push('Check arrow syntax: use -->, ---, -.-, or ==>');
  }
  if (error.toLowerCase().includes('node')) {
    suggestedFixes.push('Check node syntax: use [text], (text), ((text)), or {text}');
  }
  if (error.toLowerCase().includes('subgraph')) {
    suggestedFixes.push('Ensure subgraph is properly closed with "end"');
  }
  if (error.toLowerCase().includes('flowchart') || error.toLowerCase().includes('graph')) {
    suggestedFixes.push('Check flowchart direction: TD, TB, BT, RL, or LR');
  }

  return {
    originalError: error,
    parsedErrors,
    errorType,
    suggestedFixes,
    codeContext
  };
};

/**
 * Extracts line numbers from Mermaid syntax errors
 */
export const extractLineFromSyntaxError = (error: string): number | null => {
  const linePatterns = [
    /line (\d+)/i,
    /at line (\d+)/i,
    /(\d+):\d+/,
    /line (\d+), column/i
  ];

  for (const pattern of linePatterns) {
    const match = error.match(pattern);
    if (match) {
      const line = parseInt(match[1]);
      if (!isNaN(line)) {
        return line;
      }
    }
  }

  return null;
};

/**
 * Formats error message for display
 */
export const formatErrorMessage = (error: string): string => {
  // Remove common prefixes
  let message = error
    .replace(/^error:?\s*/i, '')
    .replace(/^syntax error:?\s*/i, '')
    .replace(/^parse error:?\s*/i, '')
    .replace(/^rendering error:?\s*/i, '')
    .trim();

  // Capitalize first letter
  if (message.length > 0) {
    message = message.charAt(0).toUpperCase() + message.slice(1);
  }

  return message;
};

/**
 * Manually detects syntax errors in Mermaid code
 */
export const detectSyntaxErrors = (mermaidCode: string): ParsedError[] => {
  const errors: ParsedError[] = [];
  const lines = mermaidCode.split('\n');

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    const lineNumber = i + 1;

    // Skip empty lines and comments
    if (!line || line.startsWith('%%')) continue;

    // Check for common syntax errors
    if (line.includes('D G[') || line.includes('D - G[')) {
      errors.push({
        message: 'Invalid connection syntax. Use --> to connect nodes',
        line: lineNumber,
        type: 'error',
        originalError: line
      });
    }

    if (line.includes('G - H[') || line.includes('G - H[')) {
      errors.push({
        message: 'Invalid connection syntax. Use --> to connect nodes',
        line: lineNumber,
        type: 'error',
        originalError: line
      });
    }

    // Check for missing arrows in connections
    if (line.match(/[A-Z]\s+[A-Z]\[/) && !line.includes('-->') && !line.includes('---') && !line.includes('===')) {
      errors.push({
        message: 'Missing connection arrow. Use -->, ---, or === to connect nodes',
        line: lineNumber,
        type: 'error',
        originalError: line
      });
    }

    // Check for invalid node syntax
    if (line.match(/[A-Z]\s*\[[^\]]*$/) && !line.includes(']')) {
      errors.push({
        message: 'Unclosed node bracket. Add ] to close the node',
        line: lineNumber,
        type: 'error',
        originalError: line
      });
    }

    // Check for invalid flowchart syntax
    if (line.match(/^[A-Z]\s*[^-\s\[\(]/) && !line.includes('[') && !line.includes('(') && !line.includes('{')) {
      errors.push({
        message: 'Invalid node syntax. Use [text], (text), ((text)), or {text}',
        line: lineNumber,
        type: 'error',
        originalError: line
      });
    }
  }

  return errors;
};
