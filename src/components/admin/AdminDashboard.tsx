
import React from 'react';
import { Users, Brain, Trophy, TrendingUp, Activity, Clock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AdminStats } from '@/types/admin';

interface AdminDashboardProps {
  stats: AdminStats;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ stats }) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-cosmic-400 mb-2">Dashboard</h2>
        <p className="text-muted-foreground">Vue d'ensemble des statistiques de la plateforme</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="bg-dark-100/50 border-cosmic-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Utilisateurs</CardTitle>
            <Users className="h-4 w-4 text-cosmic-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalUsers}</div>
            <p className="text-xs text-stellar-400">
              {stats.activeUsers} actifs cette semaine
            </p>
          </CardContent>
        </Card>

        <Card className="bg-dark-100/50 border-cosmic-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Sessions Totales</CardTitle>
            <Activity className="h-4 w-4 text-stellar-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalSessions}</div>
            <p className="text-xs text-cosmic-400">
              Sessions de jeu enregistrées
            </p>
          </CardContent>
        </Card>

        <Card className="bg-dark-100/50 border-cosmic-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Puzzles Résolus</CardTitle>
            <Brain className="h-4 w-4 text-cosmic-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats.totalPuzzlesSolved}</div>
            <p className="text-xs text-stellar-400">
              Défis relevés par tous les utilisateurs
            </p>
          </CardContent>
        </Card>

        <Card className="bg-dark-100/50 border-cosmic-500/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Score Moyen</CardTitle>
            <TrendingUp className="h-4 w-4 text-stellar-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{Math.round(stats.averageScore)}%</div>
            <p className="text-xs text-cosmic-400">
              Performance globale des utilisateurs
            </p>
          </CardContent>
        </Card>

        <Card className="bg-dark-100/50 border-cosmic-500/20 md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg text-white">Catégories Populaires</CardTitle>
            <CardDescription>Classement par nombre de sessions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {stats.popularCategories.slice(0, 5).map((category, index) => (
                <div key={category.categoryId} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-yellow-500 text-black' :
                      index === 1 ? 'bg-gray-400 text-black' :
                      index === 2 ? 'bg-orange-500 text-black' :
                      'bg-cosmic-500/30 text-cosmic-400'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="text-white font-medium">
                      {category.categoryId.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                  </div>
                  <span className="text-muted-foreground">{category.count} sessions</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDashboard;
