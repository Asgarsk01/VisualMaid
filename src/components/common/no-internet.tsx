import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCw, Signal } from 'lucide-react';
import { useOfflineRedirect } from '@/hooks';

export const NoInternet: React.FC = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isChecking, setIsChecking] = useState(false);
  const { redirectFromOffline } = useOfflineRedirect();

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-redirect when connection is restored
  useEffect(() => {
    if (isOnline) {
      const timer = setTimeout(() => {
        redirectFromOffline();
      }, 2000); // Wait 2 seconds to show the success message

      return () => clearTimeout(timer);
    }
  }, [isOnline, redirectFromOffline]);

  const handleRetry = async () => {
    setIsChecking(true);
    
    try {
      // Try to fetch a simple resource to check connectivity
      await fetch('https://www.google.com/favicon.ico', { 
        mode: 'no-cors',
        cache: 'no-cache'
      });
      
      // If we reach here, connection is restored
      redirectFromOffline();
    } catch (error) {
      // Still offline
    } finally {
      setIsChecking(false);
    }
  };

  // If connection is restored, show success message briefly
  if (isOnline) {
    return (
      <div className="h-screen w-screen bg-background text-foreground flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center space-y-4">
          <div className="animate-element animate-delay-100">
            <div className="w-24 h-24 mx-auto mb-3 bg-green-100 rounded-full flex items-center justify-center">
              <Wifi className="w-12 h-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-green-600 mb-1">
              Connection Restored!
            </h2>
            <p className="text-muted-foreground">
              Your internet connection is back. Redirecting...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen bg-background text-foreground flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center space-y-6">
        {/* No Internet Icon */}
        <div className="animate-element animate-delay-100">
          <div className="w-32 h-32 mx-auto mb-4 bg-muted/20 rounded-full flex items-center justify-center">
            <WifiOff className="w-16 h-16 text-muted-foreground" />
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-3">
          <h1 className="animate-element animate-delay-200 text-3xl font-bold">
            No Internet Connection
          </h1>
          <p className="animate-element animate-delay-300 text-muted-foreground">
            Please check your internet connection and try again.
          </p>
        </div>

        {/* Connection Status */}
        <div className="animate-element animate-delay-400 p-4 bg-muted/20 rounded-xl">
          <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
            <Signal className="w-4 h-4" />
            <span>Network Status: Offline</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="animate-element animate-delay-500 space-y-2">
          <button
            onClick={handleRetry}
            disabled={isChecking}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isChecking ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Checking...</span>
              </>
            ) : (
              <>
                <RefreshCw className="w-4 h-4" />
                <span>Try Again</span>
              </>
            )}
          </button>
        </div>

        {/* Troubleshooting Tips */}
        <div className="animate-element animate-delay-600 pt-6 border-t border-border">
          <h3 className="text-sm font-medium mb-2">Troubleshooting Tips:</h3>
          <ul className="text-xs text-muted-foreground space-y-1 text-left max-w-sm mx-auto">
            <li>• Check your Wi-Fi connection</li>
            <li>• Restart your router</li>
            <li>• Check your device's network settings</li>
            <li>• Try using mobile data</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NoInternet;
