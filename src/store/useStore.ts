import { create } from 'zustand'
import type { User, AuthState, AuthView } from '@/types/auth'
import type { Toast, ToastType } from '@/components/common'
import { AuthService } from '@/lib/firebase'

interface AppState extends AuthState {
  // Authentication actions
  signIn: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
  
  // UI state
  currentView: AuthView;
  setCurrentView: (view: AuthView) => void;
  
  // Toast state
  toasts: Toast[];
  addToast: (type: ToastType, title: string, message?: string, duration?: number) => void;
  removeToast: (id: string) => void;
  clearToasts: () => void;
  
  // Legacy counter (keeping for compatibility)
  count: number;
  increment: () => void;
  decrement: () => void;
  reset: () => void;
}

export const useStore = create<AppState>((set, get) => ({
  // Auth state
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  currentView: 'signin',
  
  // Toast state
  toasts: [],
  
  // Auth actions
  signIn: async (email: string, password: string, rememberMe?: boolean) => {
    set({ isLoading: true, error: null });
    try {
      // Firebase authentication
      const firebaseUser = await AuthService.signIn(email, password);
      
      // Create user object
      const user: User = {
        id: firebaseUser.uid,
        email: firebaseUser.email || email,
        name: email.split('@')[0], // Extract name from email
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${email}`
      };
      
      set({ 
        user, 
        isAuthenticated: true, 
        isLoading: false,
        error: null 
      });
      
      // Store in localStorage if remember me is checked
      if (rememberMe) {
        localStorage.setItem('visualmaid_user', JSON.stringify(user));
      }
      
      // Show success toast
      get().addToast('success', 'Welcome back!', 'You have been signed in successfully.');
      
      return Promise.resolve();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign in failed';
      set({ 
        isLoading: false, 
        error: null // Don't set error in state, use toast instead
      });
      
      // Show error toast
      get().addToast('error', 'Sign In Failed', errorMessage);
      
      return Promise.reject(error);
    }
  },
  
    signUp: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      // Firebase authentication without auto sign-in
      await AuthService.signUpWithoutLogin(email, password);
      
      // Account created successfully - user will need to sign in manually
      set({ 
        isLoading: false,
        error: null
      });
      
      // Show success toast
      get().addToast('success', 'Account Created!', 'Your account has been created successfully. Please sign in with your credentials.');
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Sign up failed';
      set({ 
        isLoading: false, 
        error: null // Don't set error in state, use toast instead
      });
      
      // Show error toast
      get().addToast('error', 'Sign Up Failed', errorMessage);
    }
  },
  
  signOut: async () => {
    try {
      await AuthService.signOut();
      localStorage.removeItem('visualmaid_user');
      set({ 
        user: null, 
        isAuthenticated: false, 
        error: null 
      });
    } catch (error) {
      console.error('Sign out error:', error);
      // Still clear local state even if Firebase signout fails
      localStorage.removeItem('visualmaid_user');
      set({ 
        user: null, 
        isAuthenticated: false, 
        error: null 
      });
    }
  },
  
  clearError: () => set({ error: null }),
  
  // Toast actions
  addToast: (type: ToastType, title: string, message?: string, duration?: number) => {
    const id = Date.now().toString() + Math.random().toString(36).substr(2, 9);
    const toast: Toast = {
      id,
      type,
      title,
      message,
      duration: duration || 5000
    };
    
    set((state) => ({
      toasts: [...state.toasts, toast]
    }));
  },
  
  removeToast: (id: string) => {
    set((state) => ({
      toasts: state.toasts.filter(toast => toast.id !== id)
    }));
  },
  
  clearToasts: () => set({ toasts: [] }),
  
  // UI actions
  setCurrentView: (view: AuthView) => set({ currentView: view, error: null }),
  
  // Legacy counter
  count: 0,
  increment: () => set((state) => ({ count: state.count + 1 })),
  decrement: () => set((state) => ({ count: state.count - 1 })),
  reset: () => set({ count: 0 }),
}))