import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Helper to check if we have valid Supabase credentials
const hasSupabaseCredentials = () => {
  const url = import.meta.env.VITE_SUPABASE_URL;
  const key = import.meta.env.VITE_SUPABASE_ANON_KEY;
  return url && key && url !== 'https://your-project.supabase.co' && key !== 'your-anon-key';
};

// Mock Supabase Client for development/demo without backend
const createMockClient = (): SupabaseClient => {
  console.warn('⚠️ Supabase credentials missing. Running in MOCK MODE.');

  const mockStorage = new Map();

  // Helper for chainable responses
  const createChainable = (data: any = null, error: any = null) => {
    const promise = Promise.resolve({ data, error });
    return Object.assign(promise, {
      select: () => createChainable(data, error),
      single: () => createChainable(data, error),
      maybeSingle: () => createChainable(data, error),
      order: () => createChainable(data, error),
      limit: () => createChainable(data, error),
      eq: () => createChainable(data, error),
      insert: () => createChainable(data, error),
      update: () => createChainable(data, error),
      delete: () => createChainable(data, error),
    });
  };

  // Simple mock implementation
  const mockClient = {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: (callback: any) => {
        return { data: { subscription: { unsubscribe: () => { } } } };
      },
      signUp: async ({ email, password, options }: any) => {
        console.log('Mock SignUp:', email);
        return {
          data: {
            user: {
              id: 'mock-user-id',
              email,
              user_metadata: options?.data
            },
            session: { access_token: 'mock-token' }
          },
          error: null
        };
      },
      signInWithPassword: async ({ email }: { email: string }) => {
        console.log('Mock SignIn:', email);
        return {
          data: {
            user: { id: 'mock-user-id', email },
            session: { access_token: 'mock-token' }
          },
          error: null
        };
      },
      signOut: async () => {
        console.log('Mock SignOut');
        return { error: null };
      },
      getUser: async () => ({ data: { user: null }, error: null }),
    },
    from: (table: string) => {
      return {
        select: () => {
          if (table === 'profiles') {
            return createChainable({
              id: 'mock-user-id',
              email: 'test@example.com',
              username: 'DemoUser',
              created_at: new Date().toISOString(),
              level: 1,
              total_xp: 0,
              streak: 0
            }, null);
          }
          return createChainable([], null);
        },
        insert: (data: any) => {
          console.log(`Mock Insert into ${table}:`, data);
          // Return the inserted data as if it was returned by select()
          return createChainable(data, null);
        },
        update: (data: any) => ({
          eq: () => {
            console.log(`Mock Update ${table}:`, data);
            return createChainable(data, null);
          }
        }),
        upsert: (data: any) => {
          console.log(`Mock Upsert into ${table}:`, data);
          return createChainable(data, null);
        },
        delete: () => ({
          eq: () => {
            console.log(`Mock Delete from ${table}`);
            return createChainable(null, null);
          }
        })
      };
    }
  } as unknown as SupabaseClient;

  return mockClient;
};

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key';

// FORCED MOCK MODE: Set this to true to force the app to use the mock client
// regardless of environment variables. This is useful if your Supabase project
// is paused or if you want to test the UI without a backend.
const FORCE_MOCK_MODE = true;

export const supabase = (hasSupabaseCredentials() && !FORCE_MOCK_MODE)
  ? createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true
    }
  })
  : createMockClient();

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