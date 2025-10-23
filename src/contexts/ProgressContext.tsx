
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { SecureStorage } from '@/utils/security';
import { supabase } from '@/utils/supabase';

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

  const loadProgress = useCallback(async () => {
    if (!user?.id) return;

    try {
      // Load user profile stats
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('level, total_xp, streak')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('Error loading profile:', profileError);
        return;
      }

      // Load category progress
      const { data: progressData, error: progressError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id);

      if (progressError) {
        console.error('Error loading progress:', progressError);
        return;
      }

      // Convert database format to app format
      const categoryProgressMap: Record<string, CategoryProgress> = {};
      progressData.forEach(item => {
        categoryProgressMap[item.category_id] = {
          progress: item.progress,
          level: item.level,
          puzzlesCompleted: item.puzzles_completed,
          isLocked: item.level < 2, // Unlock logic based on level
          lastPlayed: item.last_played,
          bestScore: item.best_score,
          totalTime: item.total_time
        };
      });

      // Fill missing categories with defaults
      Object.keys(defaultCategoryProgress).forEach(categoryId => {
        if (!categoryProgressMap[categoryId]) {
          categoryProgressMap[categoryId] = { ...defaultCategoryProgress[categoryId] };
        }
      });

      // Calculate stats from profile and progress
      const totalPuzzlesSolved = progressData.reduce((sum, item) => sum + item.puzzles_completed, 0);
      const averageScore = progressData.length > 0 ?
        progressData.reduce((sum, item) => sum + (item.best_score || 0), 0) / progressData.length : 0;

      const userStats: UserStats = {
        totalXP: profile.total_xp,
        level: profile.level,
        streak: profile.streak,
        puzzlesSolved: totalPuzzlesSolved,
        averageScore: Math.floor(averageScore),
        timeSpent: progressData.reduce((sum, item) => sum + item.total_time, 0),
        achievements: 0, // TODO: Calculate from achievements table
        weeklyProgress: totalPuzzlesSolved,
        lastPlayDate: progressData.length > 0 ?
          progressData.sort((a, b) => new Date(b.last_played).getTime() - new Date(a.last_played).getTime())[0].last_played :
          undefined
      };

      setUserStats(userStats);
      setCategoryProgress(categoryProgressMap);
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  }, [user?.id]);

  // Load progress from Supabase
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

  const saveProgress = async () => {
    if (!user) return;

    try {
      // Update profile stats
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          level: userStats.level,
          total_xp: userStats.totalXP,
          streak: userStats.streak,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (profileError) {
        console.error('Error saving profile:', profileError);
      }

      // Update category progress
      const progressUpdates = Object.entries(categoryProgress).map(([categoryId, progress]) => ({
        user_id: user.id,
        category_id: categoryId,
        level: progress.level,
        puzzles_completed: progress.puzzlesCompleted,
        progress: progress.progress,
        best_score: progress.bestScore || 0,
        total_time: progress.totalTime || 0,
        last_played: progress.lastPlayed || new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));

      for (const update of progressUpdates) {
        const { error } = await supabase
          .from('user_progress')
          .upsert(update, {
            onConflict: 'user_id,category_id'
          });

        if (error) {
          console.error('Error saving progress:', error);
        }
      }

      // Mark for sync when online (for future offline support)
      if (!isOnline) {
        SecureStorage.setItem(`cogniquest_needs_sync_${user.id}`, true);
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

  const resetProgress = async () => {
    if (!user) return;

    try {
      // Reset profile stats
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          level: 1,
          total_xp: 0,
          streak: 0,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (profileError) {
        console.error('Error resetting profile:', profileError);
      }

      // Delete all progress records
      const { error: progressError } = await supabase
        .from('user_progress')
        .delete()
        .eq('user_id', user.id);

      if (progressError) {
        console.error('Error resetting progress:', progressError);
      }

      // Reset local state
      setUserStats(defaultUserStats);
      setCategoryProgress(defaultCategoryProgress);
    } catch (error) {
      console.error('Error resetting progress:', error);
    }
  };

  const syncProgress = async (): Promise<void> => {
    if (!user || !isOnline) return;

    setIsLoading(true);
    try {
      // Force reload progress from database to ensure sync
      await loadProgress();

      SecureStorage.removeItem(`cogniquest_needs_sync_${user.id}`);
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
