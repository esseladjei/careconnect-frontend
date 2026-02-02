/**
 * Custom hook to get authentication data (token and userId) from localStorage
 * Use this hook in any component that needs the user ID
 */
export const useAuth = () => {
  const token = localStorage.getItem('token');
  const userId = localStorage.getItem('userId');

  return {
    token,
    userId,
    isLoggedIn: !!token && !!userId,
  };
};
