import { useEffect, useState } from 'react';
import RegisterShop from '../../components/RegisterShop';
import { useUser } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';

const MyShop: React.FC = () => {
  const { user, refreshUser } = useUser();
  const navigate = useNavigate();

  const [isSeller, setIsSeller] = useState<boolean>(false);

  useEffect(() => {
    if (user && user.role === 'SHOP_MANAGER') {
      navigate('/manager-shop');
      setIsSeller(true);
    }
  }, [user]);
  return (
    <>
      <div>{isSeller ? null : <RegisterShop />}</div>
    </>
  );
};

export default MyShop;
