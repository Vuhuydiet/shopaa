import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getShop } from '../../service/shopService';
import HeaderShop from '../../components/Shop/HeaderShop';

const ShopPage: React.FC = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const [shopInfo, setShopInfo] = useState({});
  console.log(shopId);

  useEffect(() => {
    const fetchShopData = async () => {
      if (shopId) {
        try {
          const result = await getShop(parseInt(shopId ?? '0', 10));
          console.log(result);
          setShopInfo(result.metadata.shop);
        } catch (error) {
          console.error('Error fetching shop data', error);
        }
      }
    };

    fetchShopData();
  }, [shopId]);
  console.log(shopInfo);
  return (
    <>
      <HeaderShop shopInfo={shopInfo} />
      <div
        style={{
          background: '#FDF5E6',
          height: '70vh',
          marginTop: '20px',
          color: 'black',
        }}
      >
        List Product of Shop
      </div>
    </>
  );
};

export default ShopPage;
