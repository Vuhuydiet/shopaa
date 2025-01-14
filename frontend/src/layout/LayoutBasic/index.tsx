import React from 'react';
import { Outlet } from 'react-router-dom';
import HeaderComponent from '../../components/Header';
import './LayoutStyle.css';
import { CartProvider } from '../../context/CartContext';
import { useUser } from '../../context/UserContext';

const LayoutBasic: React.FC = () => {
  const { user } = useUser();

  return (
    <>
      <div className="layout">
        {user?.role === 'USER' ? (
          <CartProvider>
            <HeaderComponent />
          </CartProvider>
        ) : (
          <HeaderComponent />
        )}

        <main className="layout__content">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default LayoutBasic;
