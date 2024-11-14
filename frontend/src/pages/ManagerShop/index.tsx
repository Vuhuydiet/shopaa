import { Outlet } from 'react-router-dom';
import ManagerShopSidebar from '../../components/ManagerShopSidebar';
import UploadProductForm from '../../components/UpLoadProduct/UpLoadProductFrom';

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
          <UploadProductForm />
        </div>
      </div>
    </>
  );
};

export default ManagerShop;
