import { useMutation } from '@tanstack/react-query';
import type { ForgotPasswordResponse } from '../api/forgotPasswordApi';
import { requestPasswordReset } from '../api/forgotPasswordApi';
import type { AxiosError } from 'axios';

interface ForgotPasswordParams {
  email: string;
  mfaToken?: string;
}

/**
 * Hook to request password reset
 */
export const useForgotPassword = () => {
  return useMutation<ForgotPasswordResponse, AxiosError, ForgotPasswordParams>({
    mutationFn: ({ email, mfaToken }: ForgotPasswordParams) =>
      requestPasswordReset({ email }, mfaToken),
  });
};
