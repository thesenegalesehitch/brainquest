
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';

interface CategoryProgress {
  progress: number;
  level: number;
  puzzlesCompleted: number;
  isLocked: boolean;
  lastPlayed?: string;
  bestScore?: number;
  totalTime?: number;
}

interface UserStats {
  totalXP: number;
  level: number;
  streak: number;
  puzzlesSolved: number;
  averageScore: number;
  timeSpent: number;
  achievements: number;
  weeklyProgress: number;
  lastPlayDate?: string;
}

interface ProgressContextType {
  userStats: UserStats;
  categoryProgress: Record<string, CategoryProgress>;
  updateProgress: (categoryId: string, level: number, score: number, timeSpent: number) => void;
  resetProgress: () => void;
  syncProgress: () => Promise<void>;
  isLoading: boolean;
}

const ProgressContext = createContext<ProgressContextType | null>(null);

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};

const defaultUserStats: UserStats = {
  totalXP: 0,
  level: 1,
  streak: 0,
  puzzlesSolved: 0,
  averageScore: 0,
  timeSpent: 0,
  achievements: 0,
  weeklyProgress: 0,
};

const defaultCategoryProgress: Record<string, CategoryProgress> = {
  'riddles-enigmas': { progress: 0, level: 1, puzzlesCompleted: 0, isLocked: false },
  'visual-puzzles': { progress: 0, level: 1, puzzlesCompleted: 0, isLocked: false },
  'logical-reasoning': { progress: 0, level: 1, puzzlesCompleted: 0, isLocked: false },
  'sequences-patterns': { progress: 0, level: 1, puzzlesCompleted: 0, isLocked: false },
  'memory-attention': { progress: 0, level: 1, puzzlesCompleted: 0, isLocked: false },
  'mental-calculation': { progress: 0, level: 1, puzzlesCompleted: 0, isLocked: true },
  'spatial-creativity': { progress: 0, level: 1, puzzlesCompleted: 0, isLocked: true },
  'emotional-intelligence': { progress: 0, level: 1, puzzlesCompleted: 0, isLocked: true },
  'spatial-orientation': { progress: 0, level: 1, puzzlesCompleted: 0, isLocked: true },
  'language-fluency': { progress: 0, level: 1, puzzlesCompleted: 0, isLocked: true }
};

export const ProgressProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isOnline } = useAuth();
  const [userStats, setUserStats] = useState<UserStats>(defaultUserStats);
  const [categoryProgress, setCategoryProgress] = useState<Record<string, CategoryProgress>>(defaultCategoryProgress);
  const [isLoading, setIsLoading] = useState(false);

  const loadProgress = useCallback(() => {
    try {
      const savedStats = localStorage.getItem(`cogniquest_stats_${user?.id}`);
      const savedCategories = localStorage.getItem(`cogniquest_categories_${user?.id}`);

      if (savedStats) {
        setUserStats(JSON.parse(savedStats));
      }

      if (savedCategories) {
        setCategoryProgress(JSON.parse(savedCategories));
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  }, [user?.id]);

  // Load progress from localStorage
  useEffect(() => {
    if (user) {
      loadProgress();
    } else {
      // Reset to defaults if no user
      setUserStats(defaultUserStats);
      setCategoryProgress(defaultCategoryProgress);
    }
  }, [user, loadProgress]);

  // Auto-save progress every 30 seconds
  useEffect(() => {
    if (user) {
      const interval = setInterval(() => {
        saveProgress();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

  const saveProgress = () => {
    if (!user) return;

    try {
      localStorage.setItem(`cogniquest_stats_${user.id}`, JSON.stringify(userStats));
      localStorage.setItem(`cogniquest_categories_${user.id}`, JSON.stringify(categoryProgress));
      
      // Mark for sync when online
      if (!isOnline) {
        localStorage.setItem(`cogniquest_needs_sync_${user.id}`, 'true');
      }
    } catch (error) {
      console.error('Error saving progress:', error);
    }
  };

  const calculateXP = (score: number, level: number, timeBonus: number): number => {
    const baseXP = score * level * 10;
    const timeMultiplier = Math.max(0.5, timeBonus);
    return Math.floor(baseXP * timeMultiplier);
  };

  const updateProgress = (categoryId: string, level: number, score: number, timeSpent: number) => {
    const xpGained = calculateXP(score, level, timeSpent < 60 ? 1.5 : 1.0);
    const today = new Date().toDateString();
    
    // Update user stats
    setUserStats(prev => {
      const newTotalXP = prev.totalXP + xpGained;
      const newLevel = Math.floor(newTotalXP / 1000) + 1;
      const newPuzzlesSolved = prev.puzzlesSolved + 1;
      const newTimeSpent = prev.timeSpent + timeSpent;
      const newAverageScore = Math.floor(((prev.averageScore * prev.puzzlesSolved) + score) / newPuzzlesSolved);
      
      const isConsecutiveDay = prev.lastPlayDate === new Date(Date.now() - 86400000).toDateString();
      const newStreak = prev.lastPlayDate === today ? prev.streak : isConsecutiveDay ? prev.streak + 1 : 1;

      return {
        ...prev,
        totalXP: newTotalXP,
        level: newLevel,
        puzzlesSolved: newPuzzlesSolved,
        averageScore: newAverageScore,
        timeSpent: newTimeSpent,
        streak: newStreak,
        lastPlayDate: today,
        weeklyProgress: prev.weeklyProgress + 1
      };
    });

    // Update category progress
    setCategoryProgress(prev => {
      const category = prev[categoryId];
      const newPuzzlesCompleted = category.puzzlesCompleted + 1;
      const newProgress = Math.min(100, (newPuzzlesCompleted / 100) * 100);
      const canLevelUp = score >= 90 && newProgress >= 100;
      
      const updatedCategories = {
        ...prev,
        [categoryId]: {
          ...category,
          puzzlesCompleted: newPuzzlesCompleted,
          progress: newProgress,
          level: canLevelUp ? Math.min(3, category.level + 1) : category.level,
          lastPlayed: today,
          bestScore: Math.max(category.bestScore || 0, score),
          totalTime: (category.totalTime || 0) + timeSpent
        }
      };

      // Unlock new categories based on progress
      const completedCategories = Object.values(updatedCategories).filter(cat => cat.level >= 2).length;
      if (completedCategories >= 2) {
        ['mental-calculation', 'spatial-creativity'].forEach(catId => {
          if (updatedCategories[catId]) {
            updatedCategories[catId].isLocked = false;
          }
        });
      }
      if (completedCategories >= 4) {
        ['emotional-intelligence', 'spatial-orientation', 'language-fluency'].forEach(catId => {
          if (updatedCategories[catId]) {
            updatedCategories[catId].isLocked = false;
          }
        });
      }

      return updatedCategories;
    });

    // Auto-save after update
    setTimeout(saveProgress, 100);
  };

  const resetProgress = () => {
    setUserStats(defaultUserStats);
    setCategoryProgress(defaultCategoryProgress);
    if (user) {
      localStorage.removeItem(`cogniquest_stats_${user.id}`);
      localStorage.removeItem(`cogniquest_categories_${user.id}`);
    }
  };

  const syncProgress = async (): Promise<void> => {
    if (!user || !isOnline) return;

    setIsLoading(true);
    try {
      // Simulate cloud sync - in real app, this would sync with backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      localStorage.removeItem(`cogniquest_needs_sync_${user.id}`);
      console.log('Progress synced successfully');
    } catch (error) {
      console.error('Error syncing progress:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value: ProgressContextType = {
    userStats,
    categoryProgress,
    updateProgress,
    resetProgress,
    syncProgress,
    isLoading,
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};
