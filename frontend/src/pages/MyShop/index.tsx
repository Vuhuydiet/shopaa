import { useEffect, useState } from 'react';
import RegisterShop from '../../components/RegisterShop';
import { useUser } from '../../context/UserContext';

const MyShop: React.FC = () => {
  const { user } = useUser();

  const [isSeller, setIsSeller] = useState<boolean>(false);

  useEffect(() => {
    if (user && user.role === 'SHOP_MANAGER') {
      setIsSeller(true);
    }
  }, [user]);
  return (
    <>
      <div>
        {isSeller ? (
          <h1 style={{ color: 'red' }}>Your SHOP</h1>
        ) : (
          <RegisterShop />
        )}
      </div>
    </>
  );
};

export default MyShop;
