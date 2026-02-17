import { useMutation } from '@tanstack/react-query';
import type {
  ResetPasswordPayload,
  ResetPasswordResponse,
} from '../api/passwordApi';
import { resetPassword } from '../api/passwordApi';
import toast from 'react-hot-toast';

/**
 * Hook to reset user password
 */
export const useResetPassword = () => {
  return useMutation<
    ResetPasswordResponse,
    Error,
    {
      role: string;
      userId: string;
      timestamp: string;
      payload: ResetPasswordPayload;
    }
  >({
    mutationFn: async ({ role, userId, timestamp, payload }) => {
      return resetPassword(role, userId, timestamp, payload);
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Password reset successfully!');
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message || 'Failed to reset password';
      toast.error(message);
    },
  });
};
