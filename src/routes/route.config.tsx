import { Suspense, lazy, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { Loading } from '@/components/common';
import { useNetworkStatus, useOfflineRedirect } from '@/hooks';

// Lazy load components for better performance
const SignInPage = lazy(() => import('@/components/auth/sign-in').then(module => ({ default: module.SignInPage })));
const SignUpPage = lazy(() => import('@/components/auth/sign-up').then(module => ({ default: module.SignUpPage })));
const Dashboard = lazy(() => import('@/components/dashboard/Dashboard'));
const NotFound = lazy(() => import('@/components/common/not-found'));
const NoInternet = lazy(() => import('@/components/common/no-internet'));

// Offline redirect component
const OfflineRedirect = () => {
  const { redirectToOffline } = useOfflineRedirect();
  
  useEffect(() => {
    redirectToOffline();
  }, [redirectToOffline]);
  
  return <Navigate to="/no-internet" replace />;
};

// Public Route Component - Redirects authenticated users to dashboard
const PublicRoute = () => {
  const { isAuthenticated, isLoading } = useStore();
  const { isOnline } = useNetworkStatus();
  
  // Show loading while checking authentication
  if (isLoading) {
    return <Loading fullScreen text="Checking authentication..." />;
  }
  
  // Redirect to offline page if no internet
  if (!isOnline) {
    return <OfflineRedirect />;
  }
  
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <Outlet />;
};

// Private Route Component - Redirects unauthenticated users to sign-in
const PrivateRoute = () => {
  const { isAuthenticated, isLoading } = useStore();
  const { isOnline } = useNetworkStatus();
  
  // Show loading while checking authentication
  if (isLoading) {
    return <Loading fullScreen text="Checking authentication..." />;
  }
  
  // Redirect to offline page if no internet
  if (!isOnline) {
    return <OfflineRedirect />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/signin" replace />;
  }
  
  return <Outlet />;
};

// Route configuration
export const routes = [
  {
    path: '/',
    element: <Navigate to="/signin" replace />
  },
  {
    path: '/',
    element: <PublicRoute />,
    children: [
      {
        path: 'signin',
        element: (
          <Suspense fallback={<Loading fullScreen text="Loading sign in..." />}>
            <SignInPage heroImageSrc="https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80" />
          </Suspense>
        )
      },
      {
        path: 'signup',
        element: (
          <Suspense fallback={<Loading fullScreen text="Loading sign up..." />}>
            <SignUpPage heroImageSrc="https://images.unsplash.com/photo-1642615835477-d303d7dc9ee9?w=2160&q=80" />
          </Suspense>
        )
      }
    ]
  },
  {
    path: '/',
    element: <PrivateRoute />,
    children: [
      {
        path: 'dashboard',
        element: (
          <Suspense fallback={<Loading fullScreen text="Loading dashboard..." />}>
            <Dashboard />
          </Suspense>
        )
      }
    ]
  },
  {
    path: '/404',
    element: (
      <Suspense fallback={<Loading fullScreen text="Loading..." />}>
        <NotFound />
      </Suspense>
    )
  },
  {
    path: '/no-internet',
    element: (
      <Suspense fallback={<Loading fullScreen text="Loading..." />}>
        <NoInternet />
      </Suspense>
    )
  },
  {
    path: '*',
    element: <Navigate to="/404" replace />
  }
];

// Route guard hook for additional security
export const useRouteGuard = () => {
  const { isAuthenticated, isLoading } = useStore();
  
  return {
    isAuthenticated,
    isLoading,
    canAccess: (requiresAuth: boolean) => {
      if (isLoading) return false;
      return requiresAuth ? isAuthenticated : !isAuthenticated;
    }
  };
};
