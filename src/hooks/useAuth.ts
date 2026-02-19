import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { verifySession } from '../api/authApi';

interface SessionData {
  userId: string;
  email: string;
  role: string;
  providerId?: string;
  patientId?: string;
  providerStatus?: string;
}

/**
 * Custom hook to get authentication data
 * Uses cookie-based session verification for robustness
 * Falls back to localStorage as a cache to avoid constant server calls
 */
export const useAuth = () => {
  const [authState, setAuthState] = useState({
    userId: localStorage.getItem('userId') ?? '',
    role: localStorage.getItem('role') ?? '',
    providerId: localStorage.getItem('providerId') ?? '',
    patientId: localStorage.getItem('patientId') ?? '',
  });

  // Query server to verify session validity
  // Runs on mount and when dependencies change
  const {
    data: sessionData,
    isLoading: sessionLoading,
    isError: sessionError,
  } = useQuery({
    queryKey: ['auth-session'],
    queryFn: verifySession,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: false, // Don't retry on 401 to avoid loops
  });

  // If session is valid, sync server data with local state
  useEffect(() => {
    if (sessionData) {
      const { userId, role, providerId, patientId } =
        sessionData as SessionData;
      setAuthState({
        userId,
        role,
        providerId: providerId ?? '',
        patientId: patientId ?? '',
      });

      // Update localStorage with latest server state
      localStorage.setItem('userId', userId);
      localStorage.setItem('role', role);
      if (providerId) localStorage.setItem('providerId', providerId);
      if (patientId) localStorage.setItem('patientId', patientId);
    }
  }, [sessionData]);

  // If session is invalid (401/403), clear local auth
  useEffect(() => {
    if (sessionError) {
      localStorage.removeItem('userId');
      localStorage.removeItem('role');
      localStorage.removeItem('providerId');
      localStorage.removeItem('patientId');
      setAuthState({
        userId: '',
        role: '',
        providerId: '',
        patientId: '',
      });
    }
  }, [sessionError]);

  const actorId =
    authState.role === 'provider' ? authState.providerId : authState.patientId;

  return {
    userId: authState.userId,
    role: authState.role,
    actorId,
    isLoggedIn: Boolean(authState.userId && authState.role && !sessionError),
    isSessionLoading: sessionLoading,
    isSessionValid: !sessionError && !sessionLoading,
  };
};
