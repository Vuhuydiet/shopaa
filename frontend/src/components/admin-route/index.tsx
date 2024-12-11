import { Navigate, Outlet } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { Spin } from 'antd';

export const AdminRoute = () => {
  const { user, isLoading } = useUser();

  console.log(user, isLoading);

  if (isLoading) {
    return (
      <Spin
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
        }}
      />
    );
  }

  return user && user.role === 'ADMIN' ? <Outlet /> : <Navigate to="/login" />;
};
