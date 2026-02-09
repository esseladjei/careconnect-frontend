import { useAuth } from './useAuth';

export const useProviderInfo = () => {
  const { user } = useAuth();

  const isProvider = user?.role === 'provider';
  const providerId = user?.providerId || user?._id;

  return {
    isProvider,
    providerId,
    user,
  };
};
