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
