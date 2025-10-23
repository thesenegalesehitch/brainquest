
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { SecurityUtils, SecureStorage, SessionManager } from '@/utils/security';
import { authRateLimiter } from '@/utils/rateLimiter';
import { supabase } from '@/utils/supabase';
import type { User as SupabaseUser } from '@supabase/supabase-js';

interface User {
  id: string;
  email: string;
  username: string;
  createdAt: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isOnline: boolean;
  signUp: (email: string, password: string, username: string) => Promise<boolean>;
  signIn: (email: string, password: string) => Promise<boolean>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const { toast } = useToast();

  // Load user profile from database
  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    try {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', supabaseUser.id)
        .single();

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error loading profile:', error);
        return;
      }

      if (profile) {
        const userData: User = {
          id: profile.id,
          email: profile.email,
          username: profile.username,
          createdAt: profile.created_at,
        };
        setUser(userData);
      } else {
        // Create profile if it doesn't exist
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: supabaseUser.id,
            email: supabaseUser.email!,
            username: supabaseUser.user_metadata?.username || supabaseUser.email!.split('@')[0],
            level: 1,
            total_xp: 0,
            streak: 0,
          })
          .select()
          .single();

        if (insertError) {
          console.error('Error creating profile:', insertError);
          return;
        }

        if (newProfile) {
          const userData: User = {
            id: newProfile.id,
            email: newProfile.email,
            username: newProfile.username,
            createdAt: newProfile.created_at,
          };
          setUser(userData);
        }
      }
    } catch (error) {
      console.error('Error in loadUserProfile:', error);
    }
  };

  // Initialize Supabase auth state
  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        loadUserProfile(session.user);
      } else {
        setIsLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          await loadUserProfile(session.user);
        } else if (event === 'SIGNED_OUT') {
          setUser(null);
          SessionManager.clearSession();
        }
        setIsLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast({
        title: "Connexion rétablie",
        description: "Synchronisation des données en cours...",
      });
    };
    
    const handleOffline = () => {
      setIsOnline(false);
      toast({
        title: "Mode hors ligne",
        description: "Vos données seront synchronisées lors de la reconnexion",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [toast]);

  // Remove old localStorage loading since we now use Supabase auth state

  const signUp = async (email: string, password: string, username: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Rate limiting check
      if (!authRateLimiter.isAllowed(`signup_${email}`)) {
        const remainingTime = Math.ceil((authRateLimiter.getResetTime(`signup_${email}`) - Date.now()) / 1000 / 60);
        toast({
          title: "Trop de tentatives",
          description: `Veuillez réessayer dans ${remainingTime} minutes`,
          variant: "destructive",
        });
        return false;
      }

      // Validate inputs
      if (!SecurityUtils.validateEmail(email)) {
        toast({
          title: "Erreur d'inscription",
          description: "Format d'email invalide",
          variant: "destructive",
        });
        return false;
      }

      if (!SecurityUtils.validateUsername(username)) {
        toast({
          title: "Erreur d'inscription",
          description: "Nom d'utilisateur invalide (3-20 caractères, lettres/chiffres/underscore)",
          variant: "destructive",
        });
        return false;
      }

      if (!SecurityUtils.validatePassword(password)) {
        toast({
          title: "Erreur d'inscription",
          description: "Mot de passe trop faible (8+ caractères, maj/min/chiffre)",
          variant: "destructive",
        });
        return false;
      }

      // Sign up with Supabase
      const { data, error } = await supabase.auth.signUp({
        email: SecurityUtils.sanitizeInput(email),
        password,
        options: {
          data: {
            username: SecurityUtils.sanitizeInput(username),
          }
        }
      });

      if (error) {
        console.error('Supabase signup error:', error);
        toast({
          title: "Erreur d'inscription",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      if (data.user) {
        toast({
          title: "Inscription réussie",
          description: `Bienvenue ${username} ! Vérifiez votre email pour confirmer votre compte.`,
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Sign up error:', error);
      toast({
        title: "Erreur d'inscription",
        description: "Une erreur est survenue lors de l'inscription",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signIn = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Rate limiting check
      if (!authRateLimiter.isAllowed(`signin_${email}`)) {
        const remainingTime = Math.ceil((authRateLimiter.getResetTime(`signin_${email}`) - Date.now()) / 1000 / 60);
        toast({
          title: "Trop de tentatives",
          description: `Veuillez réessayer dans ${remainingTime} minutes`,
          variant: "destructive",
        });
        return false;
      }

      // Validate inputs
      if (!SecurityUtils.validateEmail(email)) {
        toast({
          title: "Erreur de connexion",
          description: "Format d'email invalide",
          variant: "destructive",
        });
        return false;
      }

      // Sign in with Supabase
      const { data, error } = await supabase.auth.signInWithPassword({
        email: SecurityUtils.sanitizeInput(email),
        password,
      });

      if (error) {
        console.error('Supabase signin error:', error);
        toast({
          title: "Erreur de connexion",
          description: error.message,
          variant: "destructive",
        });
        return false;
      }

      if (data.user) {
        // User profile will be loaded by the auth state change listener
        toast({
          title: "Connexion réussie",
          description: `Bon retour !`,
        });
        return true;
      }

      return false;
    } catch (error) {
      console.error('Sign in error:', error);
      toast({
        title: "Erreur de connexion",
        description: "Une erreur est survenue lors de la connexion",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Supabase signout error:', error);
      }

      SessionManager.clearSession();
      setUser(null);
      toast({
        title: "Déconnexion",
        description: "À bientôt !",
      });
    } catch (error) {
      console.error('Sign out error:', error);
      // Force local sign out even if Supabase fails
      SessionManager.clearSession();
      setUser(null);
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isOnline,
    signUp,
    signIn,
    signOut,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
