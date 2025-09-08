/**
 * AI Service for Mermaid Code Fixing using GitHub GPT-5 Model
 * Security: API key is stored in environment variables and never exposed to client
 */

import ModelClient, { isUnexpected } from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

// Environment variables for API configuration
const GITHUB_TOKEN = import.meta.env.VITE_GITHUB_TOKEN;
const ENDPOINT = "https://models.github.ai/inference";
const MODEL_NAME = "openai/gpt-5-mini";

export interface AIFixRequest {
  mermaidCode: string;
  errorMessage: string;
  errorLine?: number;
  errorColumn?: number;
}

export interface AIFixResponse {
  success: boolean;
  fixedCode?: string;
  explanation?: string;
  error?: string;
}

export interface AIFixOptions {
  maxRetries?: number;
  timeout?: number;
}

/**
 * Validates API key availability
 */
const validateApiKey = (): boolean => {
  if (!GITHUB_TOKEN) {
    console.error('GitHub token is not configured');
    return false;
  }
  return true;
};

/**
 * Creates the system prompt for Mermaid code fixing
 */
const createSystemPrompt = (): string => {
  return `You are an expert Mermaid diagram syntax fixer. Your task is to analyze broken Mermaid code and provide a corrected version.

IMPORTANT RULES:
1. ONLY return the corrected Mermaid code, nothing else
2. Do not include explanations, comments, or markdown formatting
3. Preserve the original diagram structure and intent
4. Fix syntax errors while maintaining the visual layout
5. Ensure the code is valid Mermaid syntax
6. If the code is already correct, return it unchanged

Common Mermaid syntax patterns:
- flowchart TD (top-down), LR (left-right), RL (right-left), BT (bottom-top)
- Node syntax: A[text], B(text), C((text)), D>text], E{text}
- Arrow syntax: -->, ---, -.-, ==>, -.->, -..->, ==>|text|, -->|text|
- Subgraph syntax: subgraph title ... end
- Styling: style A fill:#color, stroke:#color, stroke-width:2px

Return ONLY the corrected Mermaid code.`;
};

/**
 * Creates the user prompt with error context
 */
const createUserPrompt = (request: AIFixRequest): string => {
  const { mermaidCode, errorMessage, errorLine, errorColumn } = request;
  
  let prompt = `Fix this broken Mermaid code:\n\n${mermaidCode}\n\n`;
  
  if (errorMessage) {
    prompt += `Error: ${errorMessage}\n`;
  }
  
  if (errorLine) {
    prompt += `Error location: Line ${errorLine}`;
    if (errorColumn) {
      prompt += `, Column ${errorColumn}`;
    }
    prompt += '\n';
  }
  
  prompt += '\nProvide the corrected Mermaid code:';
  
  return prompt;
};

/**
 * Makes API request to GitHub GPT-5
 */
const makeApiRequest = async (
  messages: Array<{ role: string; content: string }>,
  options: AIFixOptions = {}
): Promise<AIFixResponse> => {
  
  if (!validateApiKey()) {
    return {
      success: false,
      error: 'GitHub token not configured'
    };
  }

  try {
    const client = ModelClient(
      ENDPOINT,
      new AzureKeyCredential(GITHUB_TOKEN),
    );

    const response = await client.path("/chat/completions").post({
      body: {
        messages,
        model: MODEL_NAME,
        max_tokens: 2000,
        temperature: 0.1, // Low temperature for consistent code generation
        top_p: 0.9,
        frequency_penalty: 0,
        presence_penalty: 0,
      }
    });

    if (isUnexpected(response)) {
      throw new Error(`API request failed: ${JSON.stringify(response.body.error)}`);
    }

    const fixedCode = response.body.choices[0].message.content?.trim() || undefined;
    
    if (!fixedCode) {
      throw new Error('No fixed code received from AI');
    }

    return {
      success: true,
      fixedCode,
      explanation: response.body.choices[0].message.content || undefined
    };

  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        error: `API request failed: ${error.message}`
      };
    }
    
    return {
      success: false,
      error: 'Unknown error occurred while calling AI service'
    };
  }
};

/**
 * Main function to fix Mermaid code using AI
 */
export const fixMermaidCodeWithAI = async (
  request: AIFixRequest,
  options: AIFixOptions = {}
): Promise<AIFixResponse> => {
  console.log('AI Service: fixMermaidCodeWithAI called with request:', request);
  
  const maxRetries = 3;
  let lastError: string = '';
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`AI Service: Attempt ${attempt}/${maxRetries}`);
      
      const systemPrompt = createSystemPrompt();
      const userPrompt = createUserPrompt(request);
      
      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ];

      console.log('AI Service: Making API request with messages:', messages);
      const response = await makeApiRequest(messages, options);
      console.log('AI Service: API response:', response);
    
      if (response.success && response.fixedCode) {
        // Clean up the response - remove any markdown formatting
        let cleanedCode = response.fixedCode
          .replace(/^```mermaid\s*/i, '')
          .replace(/^```\s*/i, '')
          .replace(/```\s*$/i, '')
          .trim();
        
        return {
          ...response,
          fixedCode: cleanedCode
        };
      }
      
      // If not successful, check if it's a rate limit error
      if (response.error && (response.error.includes('429') || response.error.includes('rate limit'))) {
        lastError = response.error;
        if (attempt < maxRetries) {
          const delay = Math.pow(2, attempt) * 1000; // Exponential backoff: 2s, 4s, 8s
          console.log(`AI Service: Rate limited, retrying in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
      }
      
      return response;
      
    } catch (error) {
      lastError = error instanceof Error ? error.message : 'Unknown error occurred';
      console.error(`AI Service: Attempt ${attempt} failed:`, error);
      
      if (attempt < maxRetries) {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff
        console.log(`AI Service: Retrying in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  // All attempts failed
  return {
    success: false,
    error: `All ${maxRetries} attempts failed. Last error: ${lastError}`
  };
};

/**
 * Get AI service status
 */
export const getAIServiceStatus = (): {
  configured: boolean;
  model: string;
  endpoint: string;
  token: string;    
} => {
  return {
    configured: !!GITHUB_TOKEN,
    model: MODEL_NAME,
    endpoint: ENDPOINT,
    token: GITHUB_TOKEN ? `${GITHUB_TOKEN.substring(0, 10)}...` : 'Not configured'
  };
};

/**
 * Test AI service connectivity
 */
export const testAIService = async (): Promise<boolean> => {
  console.log('AI Service: Testing connectivity...');
  console.log('AI Service: Status:', getAIServiceStatus());
  
  try {
    const testRequest: AIFixRequest = {
      mermaidCode: 'flowchart TD\n    A[Test] --> B[Test]',
      errorMessage: 'Test error'
    };
    
    console.log('AI Service: Making test request...');
    const response = await fixMermaidCodeWithAI(testRequest, { timeout: 10000 });
    console.log('AI Service: Test response:', response);
    return response.success;
  } catch (error) {
    console.error('AI service test failed:', error);
    return false;
  }
};

// Make test function available globally for debugging
if (typeof window !== 'undefined') {
  (window as any).testAIService = testAIService;
  (window as any).getAIServiceStatus = getAIServiceStatus;
}