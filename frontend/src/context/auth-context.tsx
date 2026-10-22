"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import {
  getCurrentAdmin,
  login as loginRequest,
  logout as logoutRequest,
} from "../lib/auth";

import type { Admin } from "../types/auth";

interface AuthContextValue {
  admin: Admin | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadAdmin() {
      try {
        const currentAdmin = await getCurrentAdmin();

        if (mounted) {
          setAdmin(currentAdmin);
        }
      } catch {
        if (mounted) {
          setAdmin(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadAdmin();

    return () => {
      mounted = false;
    };
  }, []);

  // login function
  async function login(email: string, password: string): Promise<void> {
    const authenticatedAdmin = await loginRequest(email, password);

    setAdmin(authenticatedAdmin);
  }

  // logout function
  async function logout(): Promise<void> {
    await logoutRequest();
    setAdmin(null);
  }

  return (
    <AuthContext.Provider
      value={{
        admin,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
