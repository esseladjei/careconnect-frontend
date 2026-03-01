import { useEffect, useState } from 'react';
import { getTimezone } from '../api/timezoneApi.ts';
import { useAuth } from './useAuth.ts';

/**
 * Hook to manage user's timezone
 * - Automatically detects timezone on mount
 * - Stores timezone in localStorage
 * - Returns the detected/stored timezone
 */

export function useTimezone() {
  const { userId } = useAuth();

  const [timezone, setTimezone] = useState<string>(() => {
    // Initialize from localStorage if available
    return localStorage.getItem('userTimezone') || 'UTC';
  });

  useEffect(() => {
    const fetchTimezone = async () => {
      // If user is logged in, fetch their timezone from the API
      if (userId) {
        try {
          const data = await getTimezone(userId);
          setTimezone(data.timezone);
          localStorage.setItem('userTimezone', data.timezone);
        } catch {
          // If API call fails, fall back to browser-detected timezone
          const detectedTimezone =
            Intl.DateTimeFormat().resolvedOptions().timeZone;
          setTimezone(detectedTimezone);
          localStorage.setItem('userTimezone', detectedTimezone);
        }
      } else {
        // Detect user's timezone automatically on mount
        const detectedTimezone =
          Intl.DateTimeFormat().resolvedOptions().timeZone;
        setTimezone(detectedTimezone);
        localStorage.setItem('userTimezone', detectedTimezone);
      }
    };

    fetchTimezone();
  }, [userId]);

  return timezone;
}
