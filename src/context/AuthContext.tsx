import { createContext, useContext } from "react";

export interface AuthUser {
  id: string;
  _id?: string;
  email: string;
  first_name?: string;
  last_name?: string;
  name?: string;
  role: number;
  profile_completed?: boolean;
  status?: "pending" | "approved" | "rejected" | null;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  logout: () => Promise<void>;
  isProfileComplete: boolean;
  refreshUser: () => Promise<void>;
}

export type { AuthContextType };

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined,
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
