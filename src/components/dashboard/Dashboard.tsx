import React, { memo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { LogOut, User, Mail, Shield } from 'lucide-react';

// Memoized Dashboard component for performance optimization
const Dashboard: React.FC = memo(() => {
  const { user, signOut } = useStore();
  const navigate = useNavigate();

  // Memoized sign out handler
  const handleSignOut = useCallback(async () => {
    try {
      await signOut();
      navigate('/signin');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  }, [signOut, navigate]);

  // Memoized navigation handlers
  const handleProfileClick = useCallback(() => {
    // Future profile functionality
  }, []);

  const handleSettingsClick = useCallback(() => {
    // Future settings functionality
  }, []);

  return (
    <div className="h-screen w-screen bg-background text-foreground flex flex-col overflow-hidden">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm">
        <div className="flex items-center justify-between p-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-lg">V</span>
            </div>
            <h1 className="text-2xl font-bold">VisualMaid</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleProfileClick}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              title="Profile"
            >
              <User className="w-5 h-5" />
            </button>
            <button
              onClick={handleSettingsClick}
              className="p-2 rounded-lg hover:bg-secondary transition-colors"
              title="Settings"
            >
              <Shield className="w-5 h-5" />
            </button>
            <button
              onClick={handleSignOut}
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-destructive text-destructive-foreground hover:bg-destructive/90 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-8 overflow-y-auto">
        <div className="max-w-4xl w-full space-y-8">
          {/* Welcome Section */}
          <div className="text-center space-y-4">
            <div className="animate-element animate-delay-100">
              {user?.avatar && (
                <img 
                  src={user.avatar} 
                  alt={user.name} 
                  className="w-24 h-24 rounded-full mx-auto mb-6 border-4 border-border shadow-lg"
                />
              )}
              <h2 className="text-5xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                Welcome back!
              </h2>
              <p className="text-xl text-muted-foreground">
                Hello, <span className="font-semibold text-foreground">{user?.name}</span>! 
                You're successfully authenticated and ready to create amazing diagrams.
              </p>
            </div>
          </div>

          {/* User Info Cards */}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="animate-element animate-delay-200">
              <div className="p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Account Details</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center space-x-2">
                    <span className="text-muted-foreground">Name:</span>
                    <span className="font-medium">{user?.name}</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <span className="text-muted-foreground">User ID:</span>
                    <span className="font-mono text-xs bg-muted px-2 py-1 rounded">
                      {user?.id}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="animate-element animate-delay-300">
              <div className="p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-sm hover:bg-card/70 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">Contact Information</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <p className="flex items-center space-x-2">
                    <span className="text-muted-foreground">Email:</span>
                    <span className="font-medium">{user?.email}</span>
                  </p>
                  <p className="flex items-center space-x-2">
                    <span className="text-muted-foreground">Status:</span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Verified
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="animate-element animate-delay-400">
            <div className="p-6 rounded-2xl border border-border bg-card/50 backdrop-blur-sm">
              <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
              <div className="grid md:grid-cols-3 gap-4">
                <button className="p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 text-left">
                  <h4 className="font-semibold mb-2">Create New Diagram</h4>
                  <p className="text-sm text-muted-foreground">Start building your next masterpiece</p>
                </button>
                <button className="p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 text-left">
                  <h4 className="font-semibold mb-2">View Templates</h4>
                  <p className="text-sm text-muted-foreground">Browse our collection of templates</p>
                </button>
                <button className="p-4 rounded-xl border border-border hover:border-primary/50 hover:bg-primary/5 transition-all duration-300 text-left">
                  <h4 className="font-semibold mb-2">Recent Projects</h4>
                  <p className="text-sm text-muted-foreground">Continue where you left off</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
});

Dashboard.displayName = 'Dashboard';

export default Dashboard;
