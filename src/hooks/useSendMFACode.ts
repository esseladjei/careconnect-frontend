import { sendMFACode } from '../api/mfaApi';
import toast from 'react-hot-toast';
import { useState } from 'react';

export function useSendMFACode() {
  const [sendingCode, setSendingCode] = useState(false);

  const sendCode = async (userId: string, method: 'email' | 'totp') => {
    try {
      setSendingCode(true);
      await sendMFACode(userId, method);

      toast.success(
        method === 'email'
          ? 'Verification code sent to your email'
          : 'Ready to enter code from your authenticator app'
      );
    } catch (err: any) {
      toast.error(
        err.response?.data?.message ||
          `Failed to send ${method} code. Please try again.`
      );
    } finally {
      setSendingCode(false);
    }
  };

  return { sendCode, sendingCode };
}
