import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export const AutoLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    console.log(token);

    try {
      const decoded = jwtDecode(token);
      const exp = decoded.exp as number;

      const timeUntilExpire = exp * 1000 - Date.now();

      if (timeUntilExpire <= 0) {
        localStorage.removeItem('token');
        navigate('/login');
        return;
      }

      const logoutTimer = setTimeout(() => {
        localStorage.removeItem('token');
        navigate('/login');
      }, timeUntilExpire);

      return () => clearTimeout(logoutTimer);
    } catch (error) {
      console.error('Invalid token:', error);
      localStorage.removeItem('token');
      navigate('/login');
    }
  }, [navigate]);

  return null;
};
