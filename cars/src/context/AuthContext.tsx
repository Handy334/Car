
"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { 
  getAuth, 
  onAuthStateChanged, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut,
  type User as FirebaseUser, // Rename to avoid conflict with your possible User type
  type Auth,
  type AuthError
} from 'firebase/auth';
import { app } from '@/lib/firebase'; // Your Firebase app instance
import { useRouter } from 'next/navigation';
import { useToast } from "@/hooks/use-toast";
import { useI18n } from './I18nContext';

interface AuthContextType {
  currentUser: FirebaseUser | null;
  isLoading: boolean;
  error: string | null;
  login: (email_address: string, parola: string) => Promise<boolean>; // Renamed parameters
  signup: (email_address: string, parola: string) => Promise<boolean>; // Renamed parameters
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const { t } = useI18n();
  const auth: Auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setIsLoading(false);
    });
    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [auth]);

  const login = useCallback(async (email_address: string, parola: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email_address, parola);
      toast({ title: t('loginSuccess') });
      router.push('/'); // Redirect to home or dashboard after login
      return true;
    } catch (e) {
      const authError = e as AuthError;
      console.error("Login error:", authError);
      setError(t('authError'));
      toast({ variant: "destructive", title: t('authError'), description: authError.message });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [auth, router, toast, t]);

  const signup = useCallback(async (email_address: string, parola: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email_address, parola);
      toast({ title: t('signupSuccess') });
      router.push('/'); // Redirect to home or dashboard after signup
      return true;
    } catch (e) {
      const authError = e as AuthError;
      console.error("Signup error:", authError);
      setError(t('authError'));
      toast({ variant: "destructive", title: t('authError'), description: authError.message });
      return false;
    } finally {
      setIsLoading(false);
    }
  }, [auth, router, toast, t]);

  const logout = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      await signOut(auth);
      toast({ title: t('logoutSuccess') });
      router.push('/login'); // Redirect to login after logout
    } catch (e) {
      const authError = e as AuthError;
      console.error("Logout error:", authError);
      setError(t('authError'));
      toast({ variant: "destructive", title: t('authError'), description: authError.message });
    } finally {
      setIsLoading(false);
    }
  }, [auth, router, toast, t]);

  const contextValue = useMemo(() => ({
    currentUser,
    isLoading,
    error,
    login,
    signup,
    logout,
  }), [currentUser, isLoading, error, login, signup, logout]);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
