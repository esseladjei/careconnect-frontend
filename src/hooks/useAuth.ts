/**
 * Custom hook to get authentication data from localStorage
 * Use this hook in any component that needs the user ID
 *
 * NOTE: Auth now uses HTTP-only cookies; no JWT is stored in localStorage.
 */
export const useAuth = () => {
  const userId = localStorage.getItem('userId') ?? '';
  const providerId = localStorage.getItem('providerId') ?? '';
  const patientId = localStorage.getItem('patientId') ?? '';
  const role = localStorage.getItem('role') ?? '';
  const actorId = role === 'provider' ? providerId : patientId;

  return {
    userId,
    role,
    actorId,
    isLoggedIn: Boolean(userId && role),
  };
};