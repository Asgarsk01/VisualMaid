import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

// Wrapper component to use hooks in class component
const ErrorFallback: React.FC<{ error?: Error; resetError: () => void }> = ({ 
  error, 
  resetError 
}) => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/signin');
  };

  return (
    <div className="h-screen w-screen bg-background text-foreground flex items-center justify-center p-8">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* Error Icon */}
        <div className="animate-element animate-delay-100">
          <div className="w-32 h-32 mx-auto mb-6 bg-destructive/10 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-16 h-16 text-destructive" />
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-4">
          <h1 className="animate-element animate-delay-200 text-3xl font-bold text-destructive">
            Something Went Wrong
          </h1>
          <p className="animate-element animate-delay-300 text-muted-foreground">
            We encountered an unexpected error. Please try again or contact support if the problem persists.
          </p>
        </div>

        {/* Error Details (Development Only) */}
        {process.env.NODE_ENV === 'development' && error && (
          <div className="animate-element animate-delay-400 p-4 bg-muted/20 rounded-xl text-left">
            <h3 className="text-sm font-medium mb-2">Error Details:</h3>
            <details className="text-xs text-muted-foreground">
              <summary className="cursor-pointer hover:text-foreground">
                Click to view error details
              </summary>
              <div className="mt-2 p-2 bg-muted rounded">
                <p className="font-mono break-words">{error.message}</p>
                {error.stack && (
                  <pre className="mt-2 text-xs overflow-x-auto">
                    {error.stack}
                  </pre>
                )}
              </div>
            </details>
          </div>
        )}

        {/* Action Buttons */}
        <div className="animate-element animate-delay-500 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={resetError}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
          
          <button
            onClick={handleGoHome}
            className="flex items-center justify-center space-x-2 px-6 py-3 border border-border bg-background text-foreground rounded-xl hover:bg-muted transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Go Home</span>
          </button>
        </div>

        {/* Support Information */}
        <div className="animate-element animate-delay-600 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            If this error continues, please contact our support team with the error details above.
          </p>
        </div>
      </div>
    </div>
  );
};

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    // Update state so the next render will show the fallback UI
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error Boundary caught an error:', error, errorInfo);
    }

    // Update state with error information
    this.setState({
      error,
      errorInfo
    });

    // In production, you might want to log this to an error reporting service
    // logErrorToService(error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      // Default error fallback
      return (
        <ErrorFallback 
          error={this.state.error} 
          resetError={this.resetError} 
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
