import { Outlet } from 'react-router-dom';
import HeaderComponent from '../../components/Header';
import { ConfigProvider } from 'antd';

export const LayoutAdmin = () => {
  return (
    <ConfigProvider
      theme={{
        token: {},
      }}
    >
      <div className="layout">
        <HeaderComponent />
        <main className="layout__content">
          <Outlet />
        </main>
      </div>
    </ConfigProvider>
  );
};
