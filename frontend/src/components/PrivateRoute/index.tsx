import { Navigate, Outlet } from 'react-router-dom';
import { useAuthContext } from '../../context/AuthContext';

const PrivateRoutes: React.FC = () => {
  const { isAuthenticated } = useAuthContext();
  return <>{isAuthenticated ? <Outlet /> : <Navigate to="/login" />}</>;
};

export default PrivateRoutes;
