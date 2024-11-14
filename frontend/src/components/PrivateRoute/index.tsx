import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';
import { Spin } from 'antd';

const PrivateRoutes: React.FC = () => {
  const { isAuthenticated, loading } = useAuthContext();

  if (loading) {
    return (
      <>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Spin />
        </div>
      </>
    );
  }
  return <>{isAuthenticated ? <Outlet /> : <Navigate to="/login" />}</>;
};

export default PrivateRoutes;
