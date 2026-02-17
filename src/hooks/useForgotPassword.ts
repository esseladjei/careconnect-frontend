import { useMutation } from '@tanstack/react-query';
import type { ForgotPasswordResponse } from '../api/forgotPasswordApi';
import { requestPasswordReset } from '../api/forgotPasswordApi';
import toast from 'react-hot-toast';

/**
 * Hook to request password reset
 */
export const useForgotPassword = () => {
  return useMutation<ForgotPasswordResponse, Error, string>({
    mutationFn: (email: string) => requestPasswordReset({ email }),
    onSuccess: (data) => {
      toast.success(data.message || 'Check your email for password reset link');
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'Failed to send reset email';
      toast.error(message);
    },
  });
};
