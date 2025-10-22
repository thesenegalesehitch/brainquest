
import { useState, useEffect } from 'react';
import { User, UserProgress, Achievement, Session, AdminStats } from '@/types/admin';
import { Puzzle } from '@/types/puzzle';
import { Category } from '@/data/categories';
import { puzzles } from '@/data/puzzles';
import { categories } from '@/data/categories';

export const useAdminData = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Simuler le chargement des données
  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = () => {
    setIsLoading(true);
    
    // Charger les utilisateurs depuis localStorage
    const storedUsers = JSON.parse(localStorage.getItem('cogniquest_users') || '[]');
    const usersWithStats = storedUsers.map((user: User) => ({
      ...user,
      level: Math.floor(Math.random() * 20) + 1,
      totalXP: Math.floor(Math.random() * 5000),
      streak: Math.floor(Math.random() * 30),
      isAdmin: user.email === 'admin@cogniquest.com'
    }));
    setUsers(usersWithStats);

    // Charger les progrès utilisateurs
    const mockProgress = usersWithStats.flatMap((user: User) =>
      categories.slice(0, 3).map(category => ({
        userId: user.id,
        categoryId: category.id,
        level: Math.floor(Math.random() * 3) + 1,
        puzzlesSolved: Math.floor(Math.random() * 100),
        totalScore: Math.floor(Math.random() * 5000),
        averageScore: Math.floor(Math.random() * 100),
        bestTime: Math.floor(Math.random() * 120) + 10,
        lastPlayed: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
      }))
    );
    setUserProgress(mockProgress);

    // Charger les achievements
    const mockAchievements: Achievement[] = [
      {
        id: 'ach_001',
        title: 'Premier Puzzle',
        description: 'Résolvez votre premier puzzle',
        icon: '🎯',
        type: 'progress',
        requirement: 1,
        xpReward: 100,
        createdAt: new Date().toISOString()
      },
      {
        id: 'ach_002',
        title: 'Série de 7',
        description: 'Maintenez une série de 7 jours',
        icon: '🔥',
        type: 'streak',
        requirement: 7,
        xpReward: 500,
        createdAt: new Date().toISOString()
      },
      {
        id: 'ach_003',
        title: 'Score Parfait',
        description: 'Obtenez un score de 100%',
        icon: '⭐',
        type: 'score',
        requirement: 100,
        xpReward: 300,
        createdAt: new Date().toISOString()
      }
    ];
    setAchievements(mockAchievements);

    // Charger les sessions
    const mockSessions = usersWithStats.slice(0, 10).map((user: User) => ({
      id: `sess_${Math.random().toString(36).substr(2, 9)}`,
      userId: user.id,
      categoryId: categories[Math.floor(Math.random() * categories.length)].id,
      level: Math.floor(Math.random() * 3) + 1,
      startTime: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000).toISOString(),
      endTime: Math.random() > 0.3 ? new Date(Date.now() - Math.random() * 12 * 60 * 60 * 1000).toISOString() : undefined,
      puzzlesSolved: Math.floor(Math.random() * 20),
      totalScore: Math.floor(Math.random() * 2000),
      violations: Math.floor(Math.random() * 3),
      status: Math.random() > 0.7 ? 'active' : Math.random() > 0.5 ? 'completed' : 'abandoned'
    }));
    setSessions(mockSessions);

    // Calculer les statistiques
    const stats: AdminStats = {
      totalUsers: usersWithStats.length,
      activeUsers: usersWithStats.filter((u: User) => Date.now() - new Date(u.createdAt).getTime() < 7 * 24 * 60 * 60 * 1000).length,
      totalSessions: mockSessions.length,
      totalPuzzlesSolved: mockProgress.reduce((sum, p) => sum + p.puzzlesSolved, 0),
      averageScore: mockProgress.length > 0 ? mockProgress.reduce((sum, p) => sum + p.averageScore, 0) / mockProgress.length : 0,
      popularCategories: categories.map(cat => ({
        categoryId: cat.id,
        count: mockProgress.filter(p => p.categoryId === cat.id).length
      })).sort((a, b) => b.count - a.count)
    };
    setAdminStats(stats);

    setIsLoading(false);
  };

  // CRUD Operations for Users
  const createUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: `user_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    localStorage.setItem('cogniquest_users', JSON.stringify(updatedUsers));
    return newUser;
  };

  const updateUser = (id: string, userData: Partial<User>) => {
    const updatedUsers = users.map(user => 
      user.id === id ? { ...user, ...userData } : user
    );
    setUsers(updatedUsers);
    localStorage.setItem('cogniquest_users', JSON.stringify(updatedUsers));
  };

  const deleteUser = (id: string) => {
    const updatedUsers = users.filter(user => user.id !== id);
    setUsers(updatedUsers);
    localStorage.setItem('cogniquest_users', JSON.stringify(updatedUsers));
    
    // Supprimer aussi les progrès associés
    setUserProgress(prev => prev.filter(p => p.userId !== id));
    setSessions(prev => prev.filter(s => s.userId !== id));
  };

  // CRUD Operations for Achievements
  const createAchievement = (achievementData: Omit<Achievement, 'id' | 'createdAt'>) => {
    const newAchievement: Achievement = {
      ...achievementData,
      id: `ach_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    const updatedAchievements = [...achievements, newAchievement];
    setAchievements(updatedAchievements);
    localStorage.setItem('cogniquest_achievements', JSON.stringify(updatedAchievements));
    return newAchievement;
  };

  const updateAchievement = (id: string, achievementData: Partial<Achievement>) => {
    const updatedAchievements = achievements.map(ach => 
      ach.id === id ? { ...ach, ...achievementData } : ach
    );
    setAchievements(updatedAchievements);
    localStorage.setItem('cogniquest_achievements', JSON.stringify(updatedAchievements));
  };

  const deleteAchievement = (id: string) => {
    const updatedAchievements = achievements.filter(ach => ach.id !== id);
    setAchievements(updatedAchievements);
    localStorage.setItem('cogniquest_achievements', JSON.stringify(updatedAchievements));
  };

  // CRUD Operations for Sessions
  const deleteSession = (id: string) => {
    const updatedSessions = sessions.filter(session => session.id !== id);
    setSessions(updatedSessions);
  };

  // CRUD Operations for User Progress
  const updateUserProgress = (userId: string, categoryId: string, progressData: Partial<UserProgress>) => {
    const updatedProgress = userProgress.map(progress => 
      progress.userId === userId && progress.categoryId === categoryId 
        ? { ...progress, ...progressData } 
        : progress
    );
    setUserProgress(updatedProgress);
  };

  const deleteUserProgress = (userId: string, categoryId: string) => {
    const updatedProgress = userProgress.filter(
      progress => !(progress.userId === userId && progress.categoryId === categoryId)
    );
    setUserProgress(updatedProgress);
  };

  return {
    // Data
    users,
    userProgress,
    achievements,
    sessions,
    adminStats,
    puzzles: Object.values(puzzles).flat(),
    categories,
    isLoading,
    
    // Actions
    loadAdminData,
    
    // User CRUD
    createUser,
    updateUser,
    deleteUser,
    
    // Achievement CRUD
    createAchievement,
    updateAchievement,
    deleteAchievement,
    
    // Session CRUD
    deleteSession,
    
    // Progress CRUD
    updateUserProgress,
    deleteUserProgress
  };
};
