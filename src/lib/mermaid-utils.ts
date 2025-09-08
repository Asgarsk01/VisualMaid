import mermaid from 'mermaid';

/**
 * Validates Mermaid code syntax
 * @param code - The Mermaid code to validate
 * @returns Promise<{ isValid: boolean; error?: string }>
 */
export const validateMermaidCode = async (code: string): Promise<{ isValid: boolean; error?: string }> => {
  if (!code.trim()) {
    return { isValid: true };
  }

  try {
    // Try to parse the diagram without rendering
    await mermaid.parse(code);
    return { isValid: true };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Invalid Mermaid syntax';
    return { isValid: false, error: errorMessage };
  }
};

/**
 * Generates a unique ID for Mermaid diagrams
 * @returns string
 */
export const generateMermaidId = (): string => {
  return `mermaid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Default Mermaid configuration
 */
export const defaultMermaidConfig = {
  startOnLoad: false,
  theme: 'default' as const,
  securityLevel: 'loose' as const,
  fontFamily: '"Inter", "Segoe UI", system-ui, sans-serif',
  fontSize: 16,
  flowchart: {
    useMaxWidth: false,
    htmlLabels: true,
    curve: 'basis' as const,
  },
  sequence: {
    useMaxWidth: false,
    diagramMarginX: 50,
    diagramMarginY: 10,
    actorMargin: 50,
    width: 150,
    height: 65,
    boxMargin: 10,
    boxTextMargin: 5,
    noteMargin: 10,
    messageMargin: 35,
  },
  gantt: {
    useMaxWidth: false,
  },
  journey: {
    useMaxWidth: false,
  },
  timeline: {
    useMaxWidth: false,
  },
  gitgraph: {
    useMaxWidth: false,
  },
  c4: {
    useMaxWidth: false,
  },
  sankey: {
    useMaxWidth: false,
  },
  pie: {
    useMaxWidth: false,
  },
  quadrantChart: {
    useMaxWidth: false,
  },
  requirement: {
    useMaxWidth: false,
  },
  mindmap: {
    useMaxWidth: false,
  },
  er: {
    useMaxWidth: false,
  },
  class: {
    useMaxWidth: false,
  },
  state: {
    useMaxWidth: false,
  },
};

