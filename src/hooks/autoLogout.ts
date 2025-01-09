'use client'
import { useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // or Next.js router if applicable
import { getItem, removeFromLocalStorage } from '@/actions/localStorage';
import { toast } from 'react-toastify';
const useAutoLogout = () => {
  const router = useRouter();
  const handleLogout = useCallback(() => {
    removeFromLocalStorage('token');
    removeFromLocalStorage('expiryTime');
    router.push('/');
  }, [router]);

  const handleSessionWarning = useCallback((remainingTime: number) => {
    const convertToTime = (time: number) => {
      return new Date(time).toISOString().substring(11, 8);
    }
    toast.warning(`Your session is about to expire in ${convertToTime(remainingTime)} minute. Please save your work!`);
  }, []);

  
  useEffect(() => {
    const authState = getItem('authstate') as { token: string; expiryTime: string };
    if(!authState) return;
    const { expiryTime, token } = authState
    if (token && expiryTime) {
      const expires = parseInt(expiryTime);
      const expiryInTimestamp = Date.now() + expires * 1000; // Calculate expiry timestamp
      const remainingTime = expiryInTimestamp - Date.now();

      if (remainingTime <= 0) {
        handleLogout(); // If expired, log out immediately
      } else {
        const warningTime = 60000; // 1 minute before expiry
        const warningTimer = setTimeout(() => {
          handleSessionWarning(remainingTime);
        }, remainingTime - warningTime);

        const logoutTimer = setTimeout(() => {
          handleLogout();
        }, remainingTime);

        // Cleanup timers on component unmount
        return () => {
          clearTimeout(warningTimer);
          clearTimeout(logoutTimer);
        };
      }
    }
  }, [handleLogout, handleSessionWarning]);
};

export default useAutoLogout;
