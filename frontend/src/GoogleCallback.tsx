import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const GoogleCallback: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch('http://localhost:3000/auth/google/callback');
        const { user, token } = await response.json();
        localStorage.setItem('token', token);
        // Redirect or update UI with user information
        navigate('/'); // Redirect to a dashboard or home page
      } catch (error) {
        console.error('Error during Google sign-in:', error);
      }
    };

    fetchUser();
  }, [navigate]);

  return <div>Signing in with Google...</div>;
};

export default GoogleCallback;