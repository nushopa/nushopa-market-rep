import { useState, useCallback, useMemo, useEffect, type ReactNode } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { AuthContext, type AuthUser } from './AuthContext';
import * as api from '../api/authApi';
import { logoutUser as apiLogout } from '../api/authApi';
import { registerUnauthorizedHandler } from '../api/httpClient';

export function AuthProvider({ children }: { children: ReactNode }) {
  const qc = useQueryClient();
  const [user, setUserState] = useState<AuthUser | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const setUser = useCallback((next: AuthUser | null) => {
    setUserState(next);
    setIsAuthenticated(!!next);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const fresh = await api.getProfileDetails();
      setUser(fresh as AuthUser);
    } catch {
      setUser(null);
    }
  }, [setUser]);

  // On mount: the cookie is httpOnly and invisible to JS, so the only way
  // to know if we're logged in is to ask the server.
  useEffect(() => {
    (async () => {
      await refreshUser();
      setIsLoading(false);
    })();
  }, [refreshUser]);

  // Any 401 from any API module (authApi, distributorApi, ...) routes
  // through here, since they all share httpClient.ts.
  useEffect(() => {
    registerUnauthorizedHandler(() => setUser(null));
  }, [setUser]);

  const logout = useCallback(async () => {
    try {
      await apiLogout();
    } catch (err) {
      console.warn('Backend logout failed', err);
    }
    setUser(null);
    qc.clear();
    window.location.href = '/';
  }, [qc, setUser]);

  const isProfileComplete = !!user?.profile_completed;

  const value = useMemo(
    () => ({ isAuthenticated, isLoading, user, setUser, logout, isProfileComplete, refreshUser }),
    [isAuthenticated, isLoading, user, setUser, logout, isProfileComplete, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}