import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Logout: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Show a logout success message
    toast.success('You have been logged out successfully!');

    // Clear all authentication data from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('providerId');
    localStorage.removeItem('patientId');
    localStorage.removeItem('role');

    // Redirect to a login page immediately
    navigate('/login');
  }, [navigate]);

  return null;
};

export default Logout;
