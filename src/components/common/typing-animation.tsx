import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useAIStore } from '@/store/ai-store';

interface TypingAnimationProps {
  originalCode: string;
  fixedCode: string;
  onComplete: () => void;
  onProgress?: (progress: number) => void;
  className?: string;
}

interface TypingAnimationState {
  currentCode: string;
  isTyping: boolean;
  currentIndex: number;
  showCursor: boolean;
}

const TypingAnimation: React.FC<TypingAnimationProps> = ({
  originalCode,
  fixedCode,
  onComplete,
  onProgress,
  className = ''
}) => {
  const { typingSpeed, setAnimating } = useAIStore();
  const [state, setState] = useState<TypingAnimationState>({
    currentCode: originalCode,
    isTyping: false,
    currentIndex: 0,
    showCursor: true,
  });
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const cursorIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Cursor blinking effect
  useEffect(() => {
    cursorIntervalRef.current = setInterval(() => {
      setState(prev => ({ ...prev, showCursor: !prev.showCursor }));
    }, 500);

    return () => {
      if (cursorIntervalRef.current) {
        clearInterval(cursorIntervalRef.current);
      }
    };
  }, []);

  // Start typing animation
  const startTyping = useCallback(() => {
    // Use setTimeout to avoid state updates during render
    setTimeout(() => {
      setAnimating(true);
      setState(prev => ({
        ...prev,
        isTyping: true,
        currentIndex: 0,
        currentCode: originalCode,
      }));
    }, 0);

    // Clear existing interval
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Calculate typing steps
    const totalSteps = fixedCode.length;

    intervalRef.current = setInterval(() => {
      setState(prev => {
        const newIndex = prev.currentIndex + 1;
        const newCode = fixedCode.substring(0, newIndex);
        
        // Update progress
        const progress = Math.min(100, (newIndex / totalSteps) * 100);
        onProgress?.(progress);

        if (newIndex >= totalSteps) {
          // Animation complete
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
          }
          setAnimating(false);
          onComplete();
          
          return {
            ...prev,
            currentCode: fixedCode,
            isTyping: false,
            currentIndex: newIndex,
          };
        }

        return {
          ...prev,
          currentCode: newCode,
          currentIndex: newIndex,
        };
      });
    }, typingSpeed);
  }, [originalCode, fixedCode, typingSpeed, onComplete, onProgress, setAnimating]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (cursorIntervalRef.current) {
        clearInterval(cursorIntervalRef.current);
      }
    };
  }, []);

  // Start animation when component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      startTyping();
    }, 500); // Small delay before starting

    return () => clearTimeout(timer);
  }, [startTyping]);

  // Prevent state updates during render
  const startTypingRef = useRef(startTyping);
  startTypingRef.current = startTyping;

  return (
    <div className={`relative ${className}`}>
      <div className="font-mono text-sm leading-relaxed whitespace-pre-wrap">
        {state.currentCode}
        {state.showCursor && (
          <span className="inline-block w-2 h-4 bg-blue-500 animate-pulse ml-1" />
        )}
      </div>
      
      {/* Progress indicator */}
      {state.isTyping && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-300 ease-out"
            style={{ 
              width: `${Math.min(100, (state.currentIndex / fixedCode.length) * 100)}%` 
            }}
          />
        </div>
      )}
    </div>
  );
};

export default TypingAnimation;
