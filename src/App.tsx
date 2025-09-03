import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { AuthService } from '@/lib/firebase';
import { ErrorBoundary, ToastContainer } from '@/components/common';
import { routes } from '@/routes/route.config';

// App component with Firebase authentication listener only
function App() {
  const { toasts, removeToast } = useStore();
  
  // Listen to Firebase authentication state changes
  useEffect(() => {
    const unsubscribe = AuthService.onAuthStateChange((firebaseUser) => {
      if (firebaseUser) {
        // User is signed in
        const user = {
          id: firebaseUser.uid,
          email: firebaseUser.email || '',
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'User',
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${firebaseUser.email}`
        };
        
        useStore.setState({ 
          user, 
          isAuthenticated: true,
          isLoading: false,
          error: null
        });
        
        // Store user data
        localStorage.setItem('visualmaid_user', JSON.stringify(user));
      } else {
        // User is signed out
        useStore.setState({ 
          user: null, 
          isAuthenticated: false,
          isLoading: false,
          error: null
        });
        
        // Clear stored user data
        localStorage.removeItem('visualmaid_user');
      }
    });

    // Cleanup subscription
    return () => unsubscribe();
  }, []);

  // Check for stored user on app load (fallback)
  useEffect(() => {
    const storedUser = localStorage.getItem('visualmaid_user');
    const { isAuthenticated } = useStore.getState();
    if (storedUser && !isAuthenticated) {
      try {
        const userData = JSON.parse(storedUser);
        useStore.setState({ 
          user: userData, 
          isAuthenticated: true 
        });
      } catch (error) {
        localStorage.removeItem('visualmaid_user');
      }
    }
  }, []);

  // Create router with routes configuration
  const router = createBrowserRouter(routes);

  return (
    <ErrorBoundary>
      <div className="bg-background text-foreground h-screen w-screen overflow-hidden">
        <RouterProvider router={router} />
        <ToastContainer toasts={toasts} onClose={removeToast} />
      </div>
    </ErrorBoundary>
  );
}

export default App;