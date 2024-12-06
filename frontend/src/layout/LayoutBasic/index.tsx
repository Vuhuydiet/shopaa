import React, { useEffect } from 'react';
import { Outlet, Navigate, useNavigate } from 'react-router-dom';
import HeaderComponent from '../../components/Header';
import './LayoutStyle.css';

const LayoutBasic: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (
      localStorage.getItem('token') &&
      localStorage.getItem('isAdmin') === 'true'
    ) {
      navigate('/admin');
    }
  }, []);

  return (
    <>
      <div className="layout">
        <HeaderComponent />
        <main className="layout__content">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default LayoutBasic;
