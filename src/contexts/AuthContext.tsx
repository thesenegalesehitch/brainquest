
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';

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

  // Load user from localStorage on app start
  useEffect(() => {
    const loadUser = () => {
      try {
        const storedUser = localStorage.getItem('cogniquest_user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          setUser(userData);
        }
      } catch (error) {
        console.error('Error loading user from localStorage:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadUser();
  }, []);

  const signUp = async (email: string, password: string, username: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Simulate API call - in real app, this would be a backend call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists (mock validation)
      const existingUsers = JSON.parse(localStorage.getItem('cogniquest_users') || '[]');
      if (existingUsers.some((u: User) => u.email === email)) {
        toast({
          title: "Erreur d'inscription",
          description: "Un compte avec cet email existe déjà",
          variant: "destructive",
        });
        return false;
      }

      const newUser: User = {
        id: crypto.randomUUID(),
        email,
        username,
        createdAt: new Date().toISOString(),
      };

      // Store user data
      existingUsers.push(newUser);
      localStorage.setItem('cogniquest_users', JSON.stringify(existingUsers));
      localStorage.setItem('cogniquest_user', JSON.stringify(newUser));
      
      setUser(newUser);
      
      toast({
        title: "Inscription réussie",
        description: `Bienvenue ${username} !`,
      });
      
      return true;
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
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const existingUsers = JSON.parse(localStorage.getItem('cogniquest_users') || '[]');
      const foundUser = existingUsers.find((u: User) => u.email === email);
      
      if (!foundUser) {
        toast({
          title: "Erreur de connexion",
          description: "Email ou mot de passe incorrect",
          variant: "destructive",
        });
        return false;
      }

      localStorage.setItem('cogniquest_user', JSON.stringify(foundUser));
      setUser(foundUser);
      
      toast({
        title: "Connexion réussie",
        description: `Bon retour ${foundUser.username} !`,
      });
      
      return true;
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

  const signOut = () => {
    localStorage.removeItem('cogniquest_user');
    setUser(null);
    toast({
      title: "Déconnexion",
      description: "À bientôt !",
    });
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
