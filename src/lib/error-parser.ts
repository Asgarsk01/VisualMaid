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
  
  // Common Mermaid error patterns
  const patterns = [
    // Line number patterns
    /line (\d+):?\s*(.+)/gi,
    /at line (\d+):?\s*(.+)/gi,
    /line (\d+), column (\d+):?\s*(.+)/gi,
    /(\d+):(\d+):?\s*(.+)/gi,
    
    // Error type patterns
    /error:?\s*(.+)/gi,
    /syntax error:?\s*(.+)/gi,
    /parse error:?\s*(.+)/gi,
    /rendering error:?\s*(.+)/gi,
  ];

  // Try to extract line numbers and error messages
  for (const pattern of patterns) {
    const matches = [...error.matchAll(pattern)];
    for (const match of matches) {
      if (match.length >= 3) {
        const line = parseInt(match[1]);
        const column = match[2] ? parseInt(match[2]) : undefined;
        const message = match[match.length - 1] || match[0];
        
        if (!isNaN(line)) {
          errors.push({
            message: message.trim(),
            line,
            column,
            type: 'error',
            originalError: error
          });
        }
      }
    }
  }

  // If no specific line numbers found, create a general error
  if (errors.length === 0) {
    // Clean up common error prefixes
    let cleanMessage = error
      .replace(/^error:?\s*/i, '')
      .replace(/^syntax error:?\s*/i, '')
      .replace(/^parse error:?\s*/i, '')
      .replace(/^rendering error:?\s*/i, '')
      .trim();

    // If message is too long, truncate it
    if (cleanMessage.length > 100) {
      cleanMessage = cleanMessage.substring(0, 100) + '...';
    }

    errors.push({
      message: cleanMessage || 'Unknown error occurred',
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
