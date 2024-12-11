import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getShop } from '../../service/shopService';
import HeaderShop from '../../components/Shop/HeaderShop';
import { ProductCatalog } from '../../components/product-catalog/product-catalog';
import { useDispatch } from 'react-redux';
import { setFilter } from '../../service/state/slices/filter-slice';
import { getUserProfile } from '../../service/userService';
import { setPagination } from '../../service/state/slices/pagination-slice';

const ShopPage: React.FC = () => {
  const { shopId } = useParams<{ shopId: string }>();
  const [shopInfo, setShopInfo] = useState({});
  const [shopManagerInfo, setShopManagerInfo] = useState({});
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchShopManagerData = async () => {
      if (shopId) {
        try {
          const result = await getUserProfile(parseInt(shopId ?? '0', 10), '');
          console.log('Result Manager: ', result.metadata.profile);
          setShopManagerInfo(result.metadata.profile);
        } catch (error) {
          console.error('Error fetching shop data', error);
        }
      }
    };
    const fetchShopData = async () => {
      if (shopId) {
        try {
          const result = await getShop(parseInt(shopId ?? '0', 10));
          setShopInfo(result.metadata.shop);
          dispatch(
            setFilter({
              shopId: parseInt(shopId),
            }),
          );
          fetchShopManagerData();
        } catch (error) {
          console.error('Error fetching shop data', error);
        }
      }
    };

    fetchShopData();
  }, [shopId]);

  return (
    <>
      <HeaderShop shopInfo={shopInfo} shopManagerInfo={shopManagerInfo} />
      <div
        style={{
          marginTop: '20px',
          color: 'black',
        }}
      >
        <ProductCatalog />
      </div>
    </>
  );
};

export default ShopPage;
