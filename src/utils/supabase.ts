import { createClient } from '@supabase/supabase-js';

// TODO: Replace with your actual Supabase URL and anon key
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          username: string;
          level: number;
          total_xp: number;
          streak: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          username: string;
          level?: number;
          total_xp?: number;
          streak?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          username?: string;
          level?: number;
          total_xp?: number;
          streak?: number;
          created_at?: string;
          updated_at?: string;
        };
      };
      user_progress: {
        Row: {
          id: string;
          user_id: string;
          category_id: string;
          level: number;
          puzzles_completed: number;
          progress: number;
          best_score: number;
          total_time: number;
          last_played: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category_id: string;
          level?: number;
          puzzles_completed?: number;
          progress?: number;
          best_score?: number;
          total_time?: number;
          last_played?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category_id?: string;
          level?: number;
          puzzles_completed?: number;
          progress?: number;
          best_score?: number;
          total_time?: number;
          last_played?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      puzzle_attempts: {
        Row: {
          id: string;
          user_id: string;
          puzzle_id: string;
          category_id: string;
          level: number;
          score: number;
          time_spent: number;
          is_correct: boolean;
          violations: number;
          ip_address?: string;
          user_agent?: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          puzzle_id: string;
          category_id: string;
          level: number;
          score: number;
          time_spent: number;
          is_correct: boolean;
          violations?: number;
          ip_address?: string;
          user_agent?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          puzzle_id?: string;
          category_id?: string;
          level?: number;
          score?: number;
          time_spent?: number;
          is_correct?: boolean;
          violations?: number;
          ip_address?: string;
          user_agent?: string;
          created_at?: string;
        };
      };
      sessions: {
        Row: {
          id: string;
          user_id: string;
          category_id: string;
          level: number;
          start_time: string;
          end_time?: string;
          puzzles_solved: number;
          total_score: number;
          violations: number;
          status: 'active' | 'completed' | 'abandoned';
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          category_id: string;
          level: number;
          start_time: string;
          end_time?: string;
          puzzles_solved?: number;
          total_score?: number;
          violations?: number;
          status?: 'active' | 'completed' | 'abandoned';
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          category_id?: string;
          level?: number;
          start_time?: string;
          end_time?: string;
          puzzles_solved?: number;
          total_score?: number;
          violations?: number;
          status?: 'active' | 'completed' | 'abandoned';
          created_at?: string;
        };
      };
      achievements: {
        Row: {
          id: string;
          title: string;
          description: string;
          icon: string;
          type: 'progress' | 'streak' | 'score';
          requirement: number;
          xp_reward: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          description: string;
          icon: string;
          type: 'progress' | 'streak' | 'score';
          requirement: number;
          xp_reward: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          description?: string;
          icon?: string;
          type?: 'progress' | 'streak' | 'score';
          requirement?: number;
          xp_reward?: number;
          created_at?: string;
        };
      };
      user_achievements: {
        Row: {
          id: string;
          user_id: string;
          achievement_id: string;
          unlocked_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          achievement_id: string;
          unlocked_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          achievement_id?: string;
          unlocked_at?: string;
        };
      };
    };
  };
}