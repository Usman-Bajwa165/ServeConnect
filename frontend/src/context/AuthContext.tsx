"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthUser, getUser, getToken, clearAuth, setAuth } from "@/lib/auth";
import { startGlobalLoading } from "@/lib/events";
import axios from "@/lib/axios";

interface AuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  login: (token: string, user: AuthUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    const currentUser = getUser();
    setUser(token && currentUser ? currentUser : null);
    setLoading(false);
  }, []);

  const login = (token: string, userData: AuthUser) => {
    setAuth(token, userData);
    setUser(userData);
  };

  const logout = () => {
    startGlobalLoading();
    clearAuth();
    setUser(null);
    router.replace("/login");
    axios.post("/auth/logout").catch(() => {});
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
