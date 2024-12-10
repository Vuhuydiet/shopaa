import React from 'react';
import { Outlet } from 'react-router-dom';
import HeaderComponent from '../../components/Header';
import './LayoutStyle.css';
import { CartProvider } from '../../context/CartContext';

const LayoutBasic: React.FC = () => {
  return (
    <>
      <div className="layout">
        <CartProvider>
          <HeaderComponent />
        </CartProvider>
        <main className="layout__content">
          <Outlet />
        </main>
      </div>
    </>
  );
};

export default LayoutBasic;
