import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { verifySession } from '../api/authApi';

interface SessionData {
  userId: string;
  email: string;
  role: string;
  providerId?: string;
  patientId?: string;
  user?: {
    userId: string;
    firstName: string;
    lastName: string;
    email: string;
    role: string;
    providerStatus?: string;
  };
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
    firstName: localStorage.getItem('firstName') ?? '',
    lastName: localStorage.getItem('lastName') ?? '',
  });

  // Check if we have a stored userId to decide if query should run
  const hasStoredUserId = Boolean(authState.userId);

  // Query server to verify session validity
  // Only runs when we have a stored userId to avoid 401 loops
  const {
    data: sessionData,
    isLoading: sessionLoading,
    isError: sessionError,
  } = useQuery({
    queryKey: ['auth-session', authState.userId],
    queryFn: verifySession,
    enabled: hasStoredUserId, // CRITICAL: Only verify if we think user is logged in
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
    retry: false, // Don't retry on 401 to avoid loops
  });

  // If session is valid, sync server data with local state
  useEffect(() => {
    if (sessionData) {
      const { userId, role, providerId, patientId, user } =
        sessionData as SessionData;
      setAuthState({
        userId,
        role,
        providerId: providerId ?? '',
        patientId: patientId ?? '',
        firstName: user?.firstName ?? '',
        lastName: user?.lastName ?? '',
      });

      // Update localStorage with latest server state
      localStorage.setItem('userId', userId);
      localStorage.setItem('role', role);
      if (providerId) localStorage.setItem('providerId', providerId);
      if (patientId) localStorage.setItem('patientId', patientId);
      if (user?.firstName) localStorage.setItem('firstName', user.firstName);
      if (user?.lastName) localStorage.setItem('lastName', user.lastName);
    }
  }, [sessionData]);

  // If session is invalid (401/403), clear local auth
  useEffect(() => {
    if (sessionError) {
      localStorage.removeItem('userId');
      localStorage.removeItem('role');
      localStorage.removeItem('providerId');
      localStorage.removeItem('patientId');
      localStorage.removeItem('firstName');
      localStorage.removeItem('lastName');
      setAuthState({
        userId: '',
        role: '',
        providerId: '',
        patientId: '',
        firstName: '',
        lastName: '',
      });
    }
  }, [sessionError]);

  const actorId =
    authState.role === 'provider' ? authState.providerId : authState.patientId;

  // If no stored userId, user is definitely not logged in (no loading needed)
  const isLoading = hasStoredUserId ? sessionLoading : false;
  const isValid = hasStoredUserId && !sessionError && !sessionLoading;

  const fullName = [authState.firstName, authState.lastName]
    .filter(Boolean)
    .join(' ');

  return {
    userId: authState.userId,
    role: authState.role,
    actorId,
    fullName,
    isLoggedIn: Boolean(authState.userId && authState.role && isValid),
    isSessionLoading: isLoading,
    isSessionValid: isValid,
  };
};
