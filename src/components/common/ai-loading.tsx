import React from 'react';
import { Loader2, Sparkles, CheckCircle, XCircle } from 'lucide-react';
import { useAIStore } from '@/store/ai-store';

interface AILoadingProps {
  className?: string;
}

const AILoading: React.FC<AILoadingProps> = ({ className = '' }) => {
  const { 
    isFixing, 
    isAnimating, 
    fixProgress, 
    currentStep, 
    error, 
    lastFixResult 
  } = useAIStore();

  if (!isFixing && !isAnimating && !error && !lastFixResult) {
    return null;
  }

  return (
    <div className={`bg-white border border-gray-200 rounded-lg shadow-lg p-4 ${className}`}>
      {/* Header */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="relative">
          {isFixing || isAnimating ? (
            <div className="relative">
              <Sparkles className="w-6 h-6 text-blue-500" />
              <Loader2 className="w-4 h-4 text-blue-500 animate-spin absolute -top-1 -right-1" />
            </div>
          ) : error ? (
            <XCircle className="w-6 h-6 text-red-500" />
          ) : lastFixResult?.success ? (
            <CheckCircle className="w-6 h-6 text-green-500" />
          ) : (
            <Sparkles className="w-6 h-6 text-gray-400" />
          )}
        </div>
        
        <div className="flex-1">
          <h3 className="text-sm font-medium text-gray-900">
            {isFixing || isAnimating ? 'AI is fixing your code...' : 
             error ? 'Fix failed' : 
             lastFixResult?.success ? 'Code fixed successfully!' : 'AI Assistant'}
          </h3>
        </div>
      </div>

      {/* Progress Bar */}
      {(isFixing || isAnimating) && (
        <div className="mb-4">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Progress</span>
            <span>{Math.round(fixProgress)}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out rounded-full"
              style={{ width: `${fixProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Current Step */}
      {currentStep && (isFixing || isAnimating) && (
        <div className="mb-4">
          <p className="text-sm text-gray-700 animate-pulse">
            {currentStep}
          </p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
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

      {/* Success Message */}
      {lastFixResult?.success && !isAnimating && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <p className="text-sm text-green-700">
            Your Mermaid code has been successfully fixed and updated in the editor!
          </p>
        </div>
      )}

      {/* Animation Status */}
      {isAnimating && (
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
