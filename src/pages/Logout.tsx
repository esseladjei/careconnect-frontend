import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { logout } from '../api/authApi';

const Logout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const runLogout = async () => {
      try {
        await logout();
        toast.success('You have been logged out successfully!');
      } catch (err: any) {
        toast.error(err.response?.data?.message || 'Server logout failed. You have been logged out locally.');
      } finally {
        // Clear all authentication data from localStorage
        localStorage.removeItem('userId');
        localStorage.removeItem('providerId');
        localStorage.removeItem('patientId');
        localStorage.removeItem('role');

        // Redirect to a login page immediately
        navigate('/login');
      }
    };
    runLogout();
  }, [navigate]);

  return null;
};

export default Logout;
