import { Outlet } from 'react-router-dom';
import ManagerShopSidebar from '../../components/ManagerShopSidebar';

const ManagerShop: React.FC = () => {
  return (
    <>
      <div className="container">
        <div className="Sidebar">
          <h2 style={{ color: 'black', textAlign: 'center' }}>My Shop</h2>
          <ManagerShopSidebar />
        </div>
        <div className="Content">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default ManagerShop;
