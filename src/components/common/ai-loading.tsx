import React from 'react';
import { useAIStore } from '@/store/ai-store';

interface AILoadingProps {
  className?: string;
}

const AILoading: React.FC<AILoadingProps> = ({ className = '' }) => {
  const { 
    isFixing, 
    isAnimating, 
    error, 
    lastFixResult 
  } = useAIStore();

  if (!isFixing && !isAnimating && !error && !lastFixResult) {
    return null;
  }

  return (
    <div className={`${className}`}>
      {/* Error Message - Only show when there's an error and not loading */}
      {error && !isFixing && !isAnimating && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md mb-4">
          <p className="text-sm text-red-700">
            {error.includes('Rate limit') || error.includes('429') ? (
              <>
                <strong>AI Service Temporarily Unavailable</strong><br />
                The AI model is currently experiencing high demand. Please try again in a few minutes.
              </>
            ) : (
              error
            )}
          </p>
        </div>
      )}
      
      {/* Animation Status */}
      {isAnimating && !isFixing && (
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
          <span>Updating code in editor...</span>
        </div>
      )}
    </div>
  );
};

export default AILoading;
