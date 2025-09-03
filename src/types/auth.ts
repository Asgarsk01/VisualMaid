export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

export interface SignInFormData {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface SignUpFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms?: boolean;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export type AuthView = 'signin' | 'signup';


