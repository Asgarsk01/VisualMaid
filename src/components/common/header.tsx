import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useEditorStore } from '@/store/editor-store';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  className?: string;
}

const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  const { user, signOut } = useStore();
  const { clearSession } = useEditorStore();
  const navigate = useNavigate();

  // Handle sign out
  const handleSignOut = useCallback(async () => {
    try {
      // Clear local storage and reset to default state
      clearSession();
      
      // Sign out from Firebase
      await signOut();
      
      // Navigate to sign in
      navigate('/signin');
    } catch (error) {
      console.error('Sign out failed:', error);
    }
  }, [signOut, navigate, clearSession]);

  return (
    <header className={`bg-white border-b border-gray-200 ${className}`}>
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo/Brand */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">V</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900">VisualMaid</h1>
        </div>
        
        {/* User Menu */}
        <div className="flex items-center space-x-4">
          {/* User Info */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <User className="w-4 h-4" />
            <span>{user?.name}</span>
          </div>
          
          {/* Sign Out Button */}
          <Button
            onClick={handleSignOut}
            variant="outline"
            size="sm"
            className="flex items-center space-x-2"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
