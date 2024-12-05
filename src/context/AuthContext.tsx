'use client';
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { getItem, setItem } from "@/utils/localStorage";
import { AuthContextType, AuthState } from "../../types/typesdefinitions";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState | null>(null);
  
  useEffect(() => {
    const item = getItem<AuthState>('authstate');
    setAuthState(item);
  }, [])

  useEffect(() => {
    if (authState) {
      setItem<AuthState>('authstate', authState);
    }
  }, [authState]);

  return (
    <AuthContext.Provider value={{ authState, setAuthState }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use AuthContext
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
