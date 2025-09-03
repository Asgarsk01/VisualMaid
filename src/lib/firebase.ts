import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  AuthError
} from 'firebase/auth';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA8a3lHP3N_2uBhFUjR2wn2rzG6TeLkUTo",
  authDomain: "visualmaid-2f0d2.firebaseapp.com",
  projectId: "visualmaid-2f0d2",
  storageBucket: "visualmaid-2f0d2.firebasestorage.app",
  messagingSenderId: "635710575489",
  appId: "1:635710575489:web:20f6d33aee3b6c4d670e80"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication
export const auth = getAuth(app);

// Authentication service class
export class AuthService {
  /**
   * Sign in with email and password
   */
  static async signIn(email: string, password: string): Promise<FirebaseUser> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(this.getErrorMessage(authError.code));
    }
  }

  /**
   * Create new user account
   */
  static async signUp(email: string, password: string): Promise<FirebaseUser> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      return userCredential.user;
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(this.getErrorMessage(authError.code));
    }
  }

  /**
   * Create new user account without auto sign-in
   */
  static async signUpWithoutLogin(email: string, password: string): Promise<void> {
    try {
      // Create the account (this will auto sign-in the user)
      await createUserWithEmailAndPassword(auth, email, password);
      // Immediately sign out to prevent auto authentication
      await signOut(auth);
    } catch (error) {
      const authError = error as AuthError;
      throw new Error(this.getErrorMessage(authError.code));
    }
  }

  /**
   * Sign out current user
   */
  static async signOut(): Promise<void> {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Sign out error:', error);
      throw new Error('Failed to sign out');
    }
  }

  /**
   * Get current authenticated user
   */
  static getCurrentUser(): FirebaseUser | null {
    return auth.currentUser;
  }

  /**
   * Listen to authentication state changes
   */
  static onAuthStateChange(callback: (user: FirebaseUser | null) => void): () => void {
    return onAuthStateChanged(auth, callback);
  }

  /**
   * Convert Firebase error codes to user-friendly messages
   */
  private static getErrorMessage(errorCode: string): string {
    switch (errorCode) {
      case 'auth/user-not-found':
        return 'No account found with this email address';
      case 'auth/wrong-password':
        return 'Incorrect password';
      case 'auth/invalid-email':
        return 'Invalid email address';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists';
      case 'auth/too-many-requests':
        return 'Too many failed attempts. Please try again later';
      case 'auth/network-request-failed':
        return 'Network error. Please check your connection';
      case 'auth/user-disabled':
        return 'This account has been disabled';
      default:
        return 'Authentication failed. Please try again';
    }
  }
}

// Export app instance for other Firebase services
export default app;
