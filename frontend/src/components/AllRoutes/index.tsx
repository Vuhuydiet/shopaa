import { useRoutes } from 'react-router-dom';
import { routes } from '../../routes';

const AllRoute: React.FC = () => {
  const elements = useRoutes(routes);

  return <>{elements}</>;
};

export default AllRoute;
