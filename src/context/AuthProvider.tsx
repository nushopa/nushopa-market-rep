import { useState, useCallback, useMemo, useEffect, useRef, type ReactNode } from 'react';
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
  const isProfileComplete = !!user?.profile_completed;

  const setUser = useCallback((next: AuthUser | null) => {
    setUserState(next);
    if (next) {
      localStorage.setItem('authUser', JSON.stringify(next));
    } else {
      localStorage.removeItem('authUser');
    }
  }, []);

  // Exposed for manual refresh — call this after login, after a profile
  // update, or anywhere else that needs the true backend state rather than
  // whatever's cached in context/localStorage.
  const refreshUser = useCallback(async () => {
    if (!localStorage.getItem('token')) return;
    try {
      const fresh = await api.getProfileDetails();
      setUser(fresh as AuthUser);
    } catch (err) {
      console.warn('Failed to refresh user profile', err);
    }
  }, [setUser]);

  // One-time refresh on mount, guarded against race conditions / unmount.
  // Note: this only fires once for the lifetime of this provider instance,
  // so it only helps if a token already exists when the app first mounts
  // (e.g. a page reload while already logged in). It will NOT re-run after
  // a fresh login — that's what refreshUser() above is for.
  const didRunRef = useRef(false);
  useEffect(() => {
    if (didRunRef.current) return;
    didRunRef.current = true;

    let ignore = false;

    (async () => {
      if (!localStorage.getItem('token')) return;
      try {
        const fresh = await api.getProfileDetails();
        if (!ignore) setUser(fresh as AuthUser);
      } catch (err) {
        console.warn('Failed to refresh user profile', err);
      }
    })();

    return () => {
      ignore = true;
    };
  }, [setUser]);

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
    () => ({ isAuthenticated, user, setUser, logout, isProfileComplete, refreshUser }),
    [isAuthenticated, user, setUser, logout, isProfileComplete, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}