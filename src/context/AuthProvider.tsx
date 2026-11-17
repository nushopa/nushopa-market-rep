import {
  useState,
  useCallback,
  useMemo,
  useEffect,
  type ReactNode,
} from "react";
import { useQueryClient } from "@tanstack/react-query";
import { AuthContext, type AuthUser } from "./AuthContext";
import * as api from "../api/authApi";
import { logoutUser as apiLogout } from "../api/authApi";
import { registerUnauthorizedHandler } from "../api/httpClient";

const clearStoredSession = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("authUser");
};

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

  useEffect(() => {
    (async () => {
      await refreshUser();
      setIsLoading(false);
    })();
  }, [refreshUser]);

  useEffect(() => {
    registerUnauthorizedHandler(() => setUser(null));
  }, [setUser]);

  const logout = useCallback(async () => {
    try {
      await apiLogout(); // needs the token, so call it BEFORE clearing storage
    } catch (err) {
      console.warn("Backend logout failed", err);
    }
    clearStoredSession();
    setUser(null);
    qc.clear();
    window.location.href = "/";
  }, [qc, setUser]);

  const isProfileComplete = !!user?.profile_completed;

  const value = useMemo(
    () => ({
      isAuthenticated,
      isLoading,
      user,
      setUser,
      logout,
      isProfileComplete,
      refreshUser,
    }),
    [
      isAuthenticated,
      isLoading,
      user,
      setUser,
      logout,
      isProfileComplete,
      refreshUser,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
