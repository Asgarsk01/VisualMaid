import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, Search } from 'lucide-react';

export const NotFound: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/signin');
  };

  const handleGoBack = () => {
    navigate(-1);
  };

  return (
    <div className="h-screen w-screen bg-background text-foreground flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center space-y-4">
        {/* Main Content */}
        <div className="space-y-4">
          <h1 className="animate-element animate-delay-200 text-6xl font-bold text-primary">
            404
          </h1>
          <h2 className="animate-element animate-delay-300 text-2xl font-semibold">
            Page Not Found
          </h2>
          <p className="animate-element animate-delay-400 text-muted-foreground">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="animate-element animate-delay-500 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={handleGoHome}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Go Home</span>
          </button>
          
          <button
            onClick={handleGoBack}
            className="flex items-center justify-center space-x-2 px-6 py-3 border border-border bg-background text-foreground rounded-xl hover:bg-muted transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>

        {/* Additional Help */}
        <div className="animate-element animate-delay-600 pt-8 border-t border-border">
          <p className="text-sm text-muted-foreground">
            If you believe this is an error, please contact support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
