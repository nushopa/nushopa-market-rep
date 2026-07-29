import { useState, useCallback, useMemo, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AuthContext, type AuthUser } from './AuthContext';
import * as api from '../api/authApi';

export function AuthProvider({ children }: { children: ReactNode }) {
  const qc = useQueryClient();

  const [user, setUserState] = useState<AuthUser | null>(() => {
    try {
      const raw = localStorage.getItem('authUser');
      return raw ? (JSON.parse(raw) as AuthUser) : null;
    } catch {
      return null;
    }
  });

  const isAuthenticated = !!localStorage.getItem('token');

   const isProfileComplete = !!user?.profileComplete;

  const setUser = useCallback((next: AuthUser | null) => {
    setUserState(next);
    if (next) {
      localStorage.setItem('authUser', JSON.stringify(next));
    } else {
      localStorage.removeItem('authUser');
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      if (localStorage.getItem('token')) {
        await api.logoutUser();
      }
    } catch (err) {
      console.warn('Backend logout failed', err);
    }

    localStorage.removeItem('token');
    localStorage.removeItem('authUser');
    localStorage.removeItem('distributorId');
    localStorage.removeItem('pendingEmail');

    qc.clear();
    window.location.href = '/';
  }, [qc]);

  const value = useMemo(
    () => ({ isAuthenticated, user, setUser, logout, isProfileComplete }),
    [isAuthenticated, user, setUser, logout, isProfileComplete]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}