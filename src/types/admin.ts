
import { Puzzle } from './puzzle';
import { Category } from '@/data/categories';

export interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
  level: number;
  totalXP: number;
  streak: number;
  isAdmin?: boolean;
}

export interface UserProgress {
  userId: string;
  categoryId: string;
  level: number;
  puzzlesSolved: number;
  totalScore: number;
  averageScore: number;
  bestTime: number;
  lastPlayed: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  type: 'progress' | 'streak' | 'score' | 'speed' | 'special';
  requirement: number;
  xpReward: number;
  createdAt: string;
}

export interface Session {
  id: string;
  userId: string;
  categoryId: string;
  level: number;
  startTime: string;
  endTime?: string;
  puzzlesSolved: number;
  totalScore: number;
  violations: number;
  status: 'active' | 'completed' | 'abandoned';
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalSessions: number;
  totalPuzzlesSolved: number;
  averageScore: number;
  popularCategories: { categoryId: string; count: number }[];
}
