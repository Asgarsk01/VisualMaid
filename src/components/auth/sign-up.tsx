import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';

// --- INTERFACES ---

interface SignUpPageProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  heroImageSrc?: string;
}

// --- SUB-COMPONENTS ---

const GlassInputWrapper = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-2xl border border-border bg-foreground/5 backdrop-blur-sm transition-colors focus-within:border-violet-400/70 focus-within:bg-violet-500/10">
    {children}
  </div>
);

// --- MAIN COMPONENT ---

export const SignUpPage: React.FC<SignUpPageProps> = ({
  title = <span className="font-light text-foreground tracking-tighter">Create Account</span>,
  description = "Join thousands of users and start your journey with us today",
  heroImageSrc,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const { signUp, isLoading } = useStore();
  const navigate = useNavigate();

  const validatePasswords = (password: string, confirmPassword: string): string | null => {
    if (password.length < 8) {
      return 'Password must be at least 8 characters long';
    }
    if (password !== confirmPassword) {
      return 'Passwords do not match';
    }
    return null;
  };

  const handleSignUp = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPasswordError(null);
    
    const formData = new FormData(event.currentTarget);
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const confirmPassword = formData.get('confirmPassword') as string;
    const agreeToTerms = formData.get('agreeToTerms') === 'on';

    if (!name || !email || !password || !confirmPassword) {
      return;
    }

    if (!agreeToTerms) {
      setPasswordError('You must agree to the terms and conditions');
      return;
    }

    const passwordValidationError = validatePasswords(password, confirmPassword);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError);
      return;
    }

    try {
      await signUp(email, password);
      // Redirect to sign-in page after successful registration
      navigate('/signin');
    } catch (error) {
      // Error is already handled in the store
      console.error('Sign up failed:', error);
    }
  };

  const handleSignIn = () => {
    navigate('/signin');
  };

  return (
    <div className="h-screen w-screen flex flex-col md:flex-row font-geist overflow-hidden">
      {/* Left column: sign-up form */}
      <section className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="flex flex-col gap-6">
            <h1 className="animate-element animate-delay-100 text-4xl md:text-5xl font-semibold leading-tight">{title}</h1>
            <p className="animate-element animate-delay-200 text-muted-foreground">{description}</p>

            {passwordError && (
              <div className="animate-element animate-delay-250 p-4 rounded-2xl bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {passwordError}
              </div>
            )}

            <form className="space-y-5" onSubmit={handleSignUp}>
              <div className="animate-element animate-delay-300">
                <label className="text-sm font-medium text-muted-foreground">Full Name</label>
                <GlassInputWrapper>
                  <input 
                    name="name" 
                    type="text" 
                    placeholder="Enter your full name" 
                    className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                    required
                    disabled={isLoading}
                  />
                </GlassInputWrapper>
              </div>

              <div className="animate-element animate-delay-350">
                <label className="text-sm font-medium text-muted-foreground">Email Address</label>
                <GlassInputWrapper>
                  <input 
                    name="email" 
                    type="email" 
                    placeholder="Enter your email address" 
                    className="w-full bg-transparent text-sm p-4 rounded-2xl focus:outline-none"
                    required
                    disabled={isLoading}
                  />
                </GlassInputWrapper>
              </div>

              <div className="animate-element animate-delay-400">
                <label className="text-sm font-medium text-muted-foreground">Password</label>
                <GlassInputWrapper>
                  <div className="relative">
                    <input 
                      name="password" 
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="Create a strong password" 
                      className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none"
                      required
                      disabled={isLoading}
                      minLength={8}
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)} 
                      className="absolute inset-y-0 right-3 flex items-center"
                      disabled={isLoading}
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                      ) : (
                        <Eye className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                      )}
                    </button>
                  </div>
                </GlassInputWrapper>
              </div>

              <div className="animate-element animate-delay-450">
                <label className="text-sm font-medium text-muted-foreground">Confirm Password</label>
                <GlassInputWrapper>
                  <div className="relative">
                    <input 
                      name="confirmPassword" 
                      type={showConfirmPassword ? 'text' : 'password'} 
                      placeholder="Confirm your password" 
                      className="w-full bg-transparent text-sm p-4 pr-12 rounded-2xl focus:outline-none"
                      required
                      disabled={isLoading}
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                      className="absolute inset-y-0 right-3 flex items-center"
                      disabled={isLoading}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                      ) : (
                        <Eye className="w-5 h-5 text-muted-foreground hover:text-foreground transition-colors" />
                      )}
                    </button>
                  </div>
                </GlassInputWrapper>
              </div>

              <div className="animate-element animate-delay-500 text-sm">
                <label className="flex items-start gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="agreeToTerms" 
                    className="w-4 h-4 rounded border-2 border-gray-300 bg-white text-primary focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary transition-colors mt-0.5"
                    disabled={isLoading}
                    required
                  />
                  <span className="text-foreground/90">
                    I agree to the <a href="#" className="text-violet-400 hover:underline transition-colors">Terms of Service</a> and <a href="#" className="text-violet-400 hover:underline transition-colors">Privacy Policy</a>
                  </span>
                </label>
              </div>

              <button 
                type="submit" 
                className="animate-element animate-delay-600 w-full rounded-2xl bg-primary py-4 font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </button>
            </form>

            <p className="animate-element animate-delay-700 text-center text-sm text-muted-foreground">
              Already have an account? <a href="#" onClick={(e) => { e.preventDefault(); handleSignIn(); }} className="text-violet-400 hover:underline transition-colors">Sign In</a>
            </p>
          </div>
        </div>
      </section>

      {/* Right column: hero image */}
      {heroImageSrc && (
        <section className="hidden md:block flex-1 relative p-4 overflow-hidden">
          <div className="animate-slide-right animate-delay-300 absolute inset-4 rounded-3xl bg-cover bg-center" style={{ backgroundImage: `url(${heroImageSrc})` }}></div>
        </section>
      )}


    </div>
  );
};