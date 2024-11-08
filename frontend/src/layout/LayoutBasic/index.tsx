import React from 'react';
import { Outlet } from 'react-router-dom';
import HeaderComponent from '../../components/Header';
import './LayoutStyle.css';

const LayoutBasic: React.FC = () => {
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
