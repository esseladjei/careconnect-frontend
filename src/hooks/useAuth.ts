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
  });

  // Only verify session if we have a userId (user is logged in)
  const hasStoredUserId = Boolean(authState.userId);

  const lastLoginTime = localStorage.getItem('lastLoginTime');
  const isFreshLogin =
    lastLoginTime && Date.now() - parseInt(lastLoginTime) < 10000; // 10 seconds

  // Query server to verify session validity
  // Runs on mount and when dependencies change
  const {
    data: sessionData,
    isLoading: sessionLoading,
    isError: sessionError,
    error: sessionErrorDetails,
  } = useQuery({
    queryKey: ['auth-session', authState.userId],
    queryFn: verifySession,
    staleTime: 10 * 60 * 1000, // 10 minutes
    gcTime: 20 * 60 * 1000, // 20 minutes
    retry: false, // Don't retry on 401 to avoid loops
    enabled: hasStoredUserId && !isFreshLogin,
  });

  // ✅ FIX: Debug logging
  useEffect(() => {
    if (sessionData) {
      console.log('✅ [AUTH] Session verified:', {
        userId: sessionData.userId,
        role: sessionData.role,
        providerId: sessionData.providerId,
        patientId: sessionData.patientId,
      });
    }
  }, [sessionData]);

  useEffect(() => {
    if (sessionError) {
      console.warn('⚠️ [AUTH] Session error:', sessionErrorDetails);
    }
  }, [sessionError, sessionErrorDetails]);

  // If session is valid, sync server data with local state
  useEffect(() => {
    if (sessionData) {
      const { userId, role, providerId, patientId } =
        sessionData as SessionData;

      // ✅ FIX: Validate we have the required fields
      if (!userId || !role) {
        console.warn(
          '⚠️ [AUTH] Missing required fields in session data:',
          sessionData
        );
        return;
      }

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

      console.log('💾 [AUTH] Synced to localStorage:', { userId, role });
    }
  }, [sessionData]);

  // If session is invalid (401/403), clear local auth
  useEffect(() => {
    if (sessionError && hasStoredUserId) {
      console.warn('❌ [AUTH] Session invalid - clearing auth');
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
  }, [sessionError, hasStoredUserId]);

  const actorId =
    authState.role === 'provider' ? authState.providerId : authState.patientId;

  // ✅ FIX: During fresh login, trust localStorage and don't wait for verification
  const isTrusted = isFreshLogin || (!sessionError && sessionData);

  return {
    userId: authState.userId,
    role: authState.role,
    actorId,
    isLoggedIn: Boolean(
      authState.userId && authState.role && (isFreshLogin || !sessionError)
    ),
    isSessionLoading: sessionLoading && hasStoredUserId && !isFreshLogin,
    isSessionValid: isTrusted && hasStoredUserId,
  };
};;;;
