import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { fixMermaidCodeWithAI, type AIFixRequest, type AIFixResponse } from '@/lib/ai-service';

export interface AIState {
  isFixing: boolean;
  isAnimating: boolean;
  fixProgress: number;
  currentStep: string;
  lastFixResult: AIFixResponse | null;
  error: string | null;
  animationSpeed: number;
  typingSpeed: number;
}

export interface AIActions {
  startFix: () => void;
  setProgress: (progress: number) => void;
  setCurrentStep: (step: string) => void;
  setAnimating: (animating: boolean) => void;
  setFixResult: (result: AIFixResponse) => void;
  setError: (error: string | null) => void;
  resetAI: () => void;
  fixCodeWithAI: (request: AIFixRequest) => Promise<AIFixResponse>;
  setAnimationSpeed: (speed: number) => void;
  setTypingSpeed: (speed: number) => void;
}

export type AIStore = AIState & AIActions;

const initialState: AIState = {
  isFixing: false,
  isAnimating: false,
  fixProgress: 0,
  currentStep: '',
  lastFixResult: null,
  error: null,
  animationSpeed: 1000, // 1 second for progress animations
  typingSpeed: 50, // 50ms per character for typing animation
};

export const useAIStore = create<AIStore>()(
  devtools(
    (set, get) => ({
      ...initialState,
      
      startFix: () => {
        set({
          isFixing: true,
          isAnimating: false,
          fixProgress: 0,
          currentStep: 'Initializing AI fix...',
          error: null,
          lastFixResult: null,
        }, false, 'startFix');
      },
      
      setProgress: (progress: number) => {
        set({ fixProgress: Math.min(100, Math.max(0, progress)) }, false, 'setProgress');
      },
      
      setCurrentStep: (currentStep: string) => {
        set({ currentStep }, false, 'setCurrentStep');
      },
      
      setAnimating: (isAnimating: boolean) => {
        set({ isAnimating }, false, 'setAnimating');
      },
      
      setFixResult: (lastFixResult: AIFixResponse) => {
        set({ 
          lastFixResult,
          isFixing: false,
          fixProgress: 100,
        }, false, 'setFixResult');
      },
      
      setError: (error: string | null) => {
        set({ 
          error,
          isFixing: false,
          isAnimating: false,
        }, false, 'setError');
      },
      
      resetAI: () => {
        set(initialState, false, 'resetAI');
      },
      
      setAnimationSpeed: (animationSpeed: number) => {
        set({ animationSpeed }, false, 'setAnimationSpeed');
      },
      
      setTypingSpeed: (typingSpeed: number) => {
        set({ typingSpeed }, false, 'setTypingSpeed');
      },
      
      fixCodeWithAI: async (request: AIFixRequest): Promise<AIFixResponse> => {
        const { startFix, setProgress, setCurrentStep, setFixResult, setError } = get();
        
        try {
          // Start the fixing process
          startFix();
          
          // Simulate progress steps with realistic timing
          const steps = [
            { progress: 10, step: 'Analyzing Mermaid code...' },
            { progress: 25, step: 'Identifying syntax errors...' },
            { progress: 40, step: 'Connecting to AI service...' },
            { progress: 60, step: 'AI is fixing the code...' },
            { progress: 80, step: 'Validating fixed code...' },
            { progress: 95, step: 'Preparing result...' },
          ];
          
          // Animate progress steps
          for (const { progress, step } of steps) {
            setProgress(progress);
            setCurrentStep(step);
            await new Promise(resolve => setTimeout(resolve, get().animationSpeed / 6));
          }
          
          // Make the actual AI request
          setCurrentStep('AI is processing your request...');
          const result = await fixMermaidCodeWithAI(request);
          
          if (result.success) {
            setFixResult(result);
            return result;
          } else {
            setError(result.error || 'AI fix failed');
            return result;
          }
          
        } catch (error) {
          const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
          setError(errorMessage);
          return {
            success: false,
            error: errorMessage
          };
        }
      },
    }),
    {
      name: 'ai-store',
    }
  )
);
