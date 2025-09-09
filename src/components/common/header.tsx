import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { useEditorStore } from '@/store/editor-store';

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
          <img 
            src="/MermAII.png" 
            alt="MermAI Logo" 
            className="h-9 w-auto"
          />
        </div>
        
        {/* User Menu */}
        <div className="flex items-center space-x-4">
          {/* User Info */}
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <User className="w-4 h-4" />
            <span>{user?.name}</span>
          </div>
          
          {/* Sign Out Button */}
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 px-3 py-2 rounded-md hover:bg-gray-50"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-sm font-medium">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
