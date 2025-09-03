import React from 'react';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  fullScreen?: boolean;
}

export const Loading: React.FC<LoadingProps> = ({ 
  size = 'md', 
  text = 'Loading...', 
  fullScreen = false 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  };

  const containerClasses = fullScreen 
    ? 'h-screen w-screen bg-background text-foreground flex items-center justify-center'
    : 'flex items-center justify-center p-8';

  return (
    <div className={containerClasses}>
      <div className="flex flex-col items-center space-y-4">
        <div className={`animate-spin rounded-full border-b-2 border-primary ${sizeClasses[size]}`}></div>
        {text && (
          <p className={`text-muted-foreground ${textSizes[size]}`}>
            {text}
          </p>
        )}
      </div>
    </div>
  );
};

export default Loading;
