/**
 * Custom hook to get authentication data (token and userId) from localStorage
 * Use this hook in any component that needs the user ID
 */
export const useAuth = () => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');
  const providerId = localStorage.getItem('providerId');
  const patientId = localStorage.getItem('patientId');
  return {
    token,
    userId,
    providerId,
    patientId,
    isLoggedIn: !!token && !!userId,
  };
};
