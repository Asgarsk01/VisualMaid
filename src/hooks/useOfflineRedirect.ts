import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Hook to handle offline redirect logic
 * Stores current path before redirecting to no-internet page
 */
export const useOfflineRedirect = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Store the current path before redirecting to no-internet
    if (location.pathname !== '/no-internet') {
      sessionStorage.setItem('previousPath', location.pathname);
    }
  }, [location.pathname]);

  const redirectToOffline = () => {
    navigate('/no-internet', { replace: true });
  };

  const redirectFromOffline = () => {
    const previousPath = sessionStorage.getItem('previousPath') || '/signin';
    navigate(previousPath, { replace: true });
  };

  return {
    redirectToOffline,
    redirectFromOffline,
    currentPath: location.pathname
  };
};
