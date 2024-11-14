import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { Spin } from 'antd';

const PrivateRoutes: React.FC = () => {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) {
    return (
      <>
        <Spin />
      </>
    );
  }
  return <>{isAuthenticated ? <Outlet /> : <Navigate to="/login" />}</>;
};

export default PrivateRoutes;
