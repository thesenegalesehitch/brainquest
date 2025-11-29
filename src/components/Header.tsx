
import React, { useState } from 'react';
import { Brain, Trophy, Zap, Settings, User, LogIn, LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useProgress } from '@/hooks/useProgress';
import { Link } from 'react-router-dom';
import AuthModal from '@/components/auth/AuthModal';
import SettingsModal from '@/components/settings/SettingsModal';
import OfflineIndicator from '@/components/OfflineIndicator';

const Header: React.FC = () => {
  const { user, signOut } = useAuth();
  const { userStats } = useProgress();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Vérifier si l'utilisateur est admin
  const isAdmin = user && (
    user.email === 'admin@cogniquest.com' ||
    user.username.toLowerCase() === 'admin' ||
    localStorage.getItem('cogniquest_admin_override') === 'true'
  );

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-cosmic-500/20 bg-dark/90 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3">
              <div className="relative">
                <Brain className="h-8 w-8 text-cosmic-400 animate-pulse-glow" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-stellar-400 rounded-full animate-ping"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-cosmic-400 to-stellar-400 bg-clip-text text-transparent">
                  CogniQuest++
                </h1>
                <p className="text-xs text-muted-foreground">Brain Training Revolution</p>
              </div>
            </Link>

            {/* User Stats - Only show if user is logged in */}
            {user && (
              <div className="hidden md:flex items-center space-x-6">
                <div className="flex items-center space-x-2 px-3 py-2 bg-dark-100/50 rounded-lg">
                  <Zap className="h-4 w-4 text-stellar-400" />
                  <span className="text-sm font-medium">{userStats.totalXP.toLocaleString()} XP</span>
                </div>

                <div className="flex items-center space-x-2 px-3 py-2 bg-dark-100/50 rounded-lg">
                  <Trophy className="h-4 w-4 text-cosmic-400" />
                  <span className="text-sm font-medium">Level {userStats.level}</span>
                </div>

                <div className="flex items-center space-x-2 px-3 py-2 bg-dark-100/50 rounded-lg">
                  <div className="w-2 h-2 bg-stellar-400 rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium">{userStats.streak} day streak</span>
                </div>
              </div>
            )}

            {/* Right side controls */}
            <div className="flex items-center space-x-3">
              <OfflineIndicator />

              {user ? (
                <>
                  {/* Admin Panel Access */}
                  {isAdmin && (
                    <Link to="/admin">
                      <Button variant="ghost" size="icon" className="hover:bg-cosmic-500/20 text-cosmic-400">
                        <Shield className="h-5 w-5" />
                      </Button>
                    </Link>
                  )}

                  <Button
                    variant="ghost"
                    size="icon"
                    className="hover:bg-cosmic-500/20"
                    onClick={() => setShowSettingsModal(true)}
                  >
                    <Settings className="h-5 w-5" />
                  </Button>
                  <div className="flex items-center space-x-2 px-3 py-2 bg-dark-100/50 rounded-lg">
                    <User className="h-4 w-4 text-cosmic-400" />
                    <span className="text-sm font-medium">{user.username}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={signOut}
                    className="hover:bg-red-500/20 text-red-400"
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                </>
              ) : (
                <Button
                  onClick={() => setShowAuthModal(true)}
                  className="bg-gradient-to-r from-cosmic-500 to-stellar-500 hover:from-cosmic-600 hover:to-stellar-600"
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Connexion
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      <SettingsModal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      />
    </>
  );
};

export default Header;
