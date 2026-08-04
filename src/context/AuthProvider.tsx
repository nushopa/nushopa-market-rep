import { useState, useCallback, useMemo, useEffect, useRef, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AuthContext, type AuthUser } from './AuthContext';
import * as api from '../api/authApi';

export function AuthProvider({ children }: { children: ReactNode }) {
  const qc = useQueryClient();

  const [user, setUserState] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user;
  const isProfileComplete = !!user?.profile_completed;

  const setUser = useCallback((next: AuthUser | null) => {
    setUserState(next);
  }, []);

  const refreshUser = useCallback(async () => {
    
    try {
      const fresh = await api.getProfileDetails();
      setUser(fresh as AuthUser);
    } catch (err) {
      console.warn('Failed to refresh user profile', err);setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [setUser]);

  const didRunRef = useRef(false);
  useEffect(() => {
    if (didRunRef.current) return;
    didRunRef.current = true;

    let ignore = false;

    (async () => {
      try {
        const fresh = await api.getProfileDetails();
        if (!ignore) setUser(fresh as AuthUser);
      } catch (err) {
        if (!ignore) {
          console.warn('Failed to refresh user profile', err);
          setUser(null);
        }
      } finally {
        if (!ignore) setIsLoading(false);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [setUser]);

  const logout = useCallback(async () => {
    try {
        await api.logoutUser();
     
    } catch (err) {
      console.warn('Backend logout failed', err);
    }

    localStorage.removeItem('distributorId');
    localStorage.removeItem('pendingEmail');

    qc.clear();
    window.location.href = '/';
  }, [qc]);

  const value = useMemo(
    () => ({ isAuthenticated, isLoading, user, setUser, logout, isProfileComplete, refreshUser }),
    [isAuthenticated, isLoading, user, setUser, logout, isProfileComplete, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}