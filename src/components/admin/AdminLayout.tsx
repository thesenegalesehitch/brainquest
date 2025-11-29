
import React from 'react';
import { Users, Trophy, Brain, BarChart3, Settings, LogOut, Shield } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, activeTab, onTabChange }) => {
  const { user, signOut } = useAuth();

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'users', label: 'Utilisateurs', icon: Users },
    { id: 'puzzles', label: 'Puzzles', icon: Brain },
    { id: 'categories', label: 'Catégories', icon: Settings },
    { id: 'achievements', label: 'Achievements', icon: Trophy },
    { id: 'sessions', label: 'Sessions', icon: Shield }
  ];

  return (
    <div className="min-h-screen bg-dark text-white">
      {/* Header */}
      <header className="border-b border-cosmic-500/20 bg-dark-100/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-cosmic-400" />
              <div>
                <h1 className="text-2xl font-bold text-cosmic-400">Admin Panel</h1>
                <p className="text-sm text-muted-foreground">CogniQuest++ Administration</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-sm">Connecté en tant que: <strong>{user?.username}</strong></span>
              <Button variant="ghost" onClick={signOut} className="text-red-400 hover:text-red-300">
                <LogOut className="h-4 w-4 mr-2" />
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="w-64 bg-dark-100/50 border-r border-cosmic-500/20 min-h-[calc(100vh-80px)]">
          <nav className="p-4">
            <ul className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <li key={tab.id}>
                    <button
                      onClick={() => onTabChange(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${activeTab === tab.id
                          ? 'bg-cosmic-500/20 text-cosmic-400 border border-cosmic-500/30'
                          : 'hover:bg-cosmic-500/10 text-muted-foreground hover:text-white'
                        }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span>{tab.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
