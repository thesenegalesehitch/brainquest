
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useAdminData } from '@/hooks/useAdminData';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminDashboard from '@/components/admin/AdminDashboard';
import UserManagement from '@/components/admin/UserManagement';
import { Loader2 } from 'lucide-react';

const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  const {
    users,
    userProgress,
    achievements,
    sessions,
    adminStats,
    puzzles,
    categories,
    isLoading,
    createUser,
    updateUser,
    deleteUser,
    createAchievement,
    updateAchievement,
    deleteAchievement,
    deleteSession,
    updateUserProgress,
    deleteUserProgress
  } = useAdminData();

  // Vérifier les permissions admin
  useEffect(() => {
    if (!user) {
      navigate('/');
      return;
    }

    const ADMIN_EMAILS = [
      'admin@cogniquest.com',
      'ndouralexandre09@gmail.com'
    ];

    // Add env var admins if configured
    const envAdmins = import.meta.env.VITE_ADMIN_EMAILS?.split(',') || [];
    const allAdmins = [...ADMIN_EMAILS, ...envAdmins].map(e => e.trim().toLowerCase());

    const isAdmin = allAdmins.includes(user.email?.toLowerCase() || '') ||
      user.username.toLowerCase() === 'admin' ||
      localStorage.getItem('cogniquest_admin_override') === 'true';

    if (!isAdmin) {
      navigate('/');
      return;
    }
  }, [user, navigate]);

  if (!user || isLoading) {
    return (
      <div className="min-h-screen bg-dark flex items-center justify-center">
        <div className="flex items-center space-x-3 text-cosmic-400">
          <Loader2 className="h-8 w-8 animate-spin" />
          <span className="text-lg">Chargement de l'interface d'administration...</span>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return adminStats ? <AdminDashboard stats={adminStats} /> : null;

      case 'users':
        return (
          <UserManagement
            users={users}
            onCreateUser={createUser}
            onUpdateUser={updateUser}
            onDeleteUser={deleteUser}
          />
        );

      case 'puzzles':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-cosmic-400 mb-2">Gestion des Puzzles</h2>
              <p className="text-muted-foreground">
                Total de {puzzles.length} puzzles disponibles dans {categories.length} catégories
              </p>
            </div>
            <div className="grid gap-4">
              {categories.map((category) => (
                <div key={category.id} className="bg-dark-100/50 border border-cosmic-500/20 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-white mb-2">{category.title}</h3>
                  <p className="text-muted-foreground mb-4">{category.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-cosmic-400">
                      {puzzles.filter(p => p.id.startsWith(category.id.split('-')[0])).length} puzzles
                    </span>
                    <span className="text-stellar-400">{category.levels.length} niveaux</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'categories':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-cosmic-400 mb-2">Gestion des Catégories</h2>
              <p className="text-muted-foreground">Configuration des catégories de puzzles</p>
            </div>
            <div className="grid gap-4">
              {categories.map((category) => (
                <div key={category.id} className="bg-dark-100/50 border border-cosmic-500/20 rounded-lg p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-2">{category.title}</h3>
                      <p className="text-muted-foreground mb-4">{category.description}</p>
                      <div className="space-y-2">
                        <p className="text-sm text-cosmic-400">
                          <strong>Compétences:</strong> {category.cognitiveSkills.join(', ')}
                        </p>
                        <p className="text-sm text-stellar-400">
                          <strong>Base scientifique:</strong> {category.scientificBasis}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'achievements':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-cosmic-400 mb-2">Gestion des Achievements</h2>
              <p className="text-muted-foreground">Récompenses et défis pour les utilisateurs</p>
            </div>
            <div className="grid gap-4">
              {achievements.map((achievement) => (
                <div key={achievement.id} className="bg-dark-100/50 border border-cosmic-500/20 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="text-3xl">{achievement.icon}</div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{achievement.title}</h3>
                        <p className="text-muted-foreground">{achievement.description}</p>
                        <div className="flex items-center space-x-4 mt-2 text-sm">
                          <span className="text-cosmic-400">Type: {achievement.type}</span>
                          <span className="text-stellar-400">Récompense: {achievement.xpReward} XP</span>
                          <span className="text-muted-foreground">Requis: {achievement.requirement}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'sessions':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl font-bold text-cosmic-400 mb-2">Gestion des Sessions</h2>
              <p className="text-muted-foreground">Sessions de jeu actives et historique</p>
            </div>
            <div className="grid gap-4">
              {sessions.slice(0, 20).map((session) => (
                <div key={session.id} className="bg-dark-100/50 border border-cosmic-500/20 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-white font-medium">Session {session.id}</span>
                        <span className={`px-2 py-1 rounded text-xs ${session.status === 'active' ? 'bg-green-500/20 text-green-400' :
                          session.status === 'completed' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-red-500/20 text-red-400'
                          }`}>
                          {session.status}
                        </span>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>Utilisateur: {users.find(u => u.id === session.userId)?.username || 'Inconnu'}</p>
                        <p>Catégorie: {session.categoryId} - Niveau {session.level}</p>
                        <p>Puzzles résolus: {session.puzzlesSolved} | Score: {session.totalScore}</p>
                        <p>Violations: {session.violations}</p>
                      </div>
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                      <p>Début: {new Date(session.startTime).toLocaleString()}</p>
                      {session.endTime && (
                        <p>Fin: {new Date(session.endTime).toLocaleString()}</p>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderTabContent()}
    </AdminLayout>
  );
};

export default AdminPage;
