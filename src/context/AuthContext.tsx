'use client';
import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";

type AuthState = {
  token: string;
  id: string;
  role: string;
};

type AuthContextType = {
  authState: AuthState | null;
  setAuthState: (state: AuthState | null) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const getInitialState = () => {
  const currentUser = localStorage.getItem("authstate");
  return currentUser ? JSON.parse(currentUser) : null
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [authState, setAuthState] = useState<AuthState | null>(getInitialState);
  useEffect(() => {
    if (authState) {
      localStorage.setItem("authstate", JSON.stringify(authState));
    } else {
      localStorage.removeItem("authstate"); // Clean up if logged out
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
