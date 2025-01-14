import { List, Spin } from 'antd';
import { ProductCard } from '../product-card/product-card';
import { IProduct } from '../../interfaces/IProduct';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../service/state/store';
import { useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { filterAsync } from '../../service/state/actions/filter-action';
import { PRODUCTS_FILTER } from '../../config/constants';

export const ProductGrid = () => {
  const { products, isLoading } = useSelector(
    (state: RootState) => state.filters,
  );
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const filter = useSelector((state: RootState) => state.filters.filter);

  useEffect(() => {
    if (location.pathname === '/home') {
      dispatch(
        filterAsync({
          ...filter,
          shopId: undefined,
          category: undefined,
          offset: 0,
          limit: PRODUCTS_FILTER.ITEMS_PER_PAGE,
        }),
      );
    }
  }, [location]);

  if (isLoading) {
    return (
      <Spin
        style={{
          margin: '100px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      />
    );
  }

  return (
    <List
      grid={{
        gutter: 16,
        xs: 1,
        sm: 2,
        md: 3,
        lg: 4,
        xl: 4,
        xxl: 4,
      }}
      dataSource={products}
      renderItem={(item: IProduct) => (
        <List.Item key={item.id}>
          <ProductCard
            id={item.id}
            image={item.images[0]?.url || ''}
            title={item.name}
            quantity={item.quantity}
            originalPrice={item.originalPrice}
            currentPrice={item.currentPrice}
            star={
              item.numReviews
                ? Number((item.totalRating / item.numReviews).toFixed(1))
                : 0
            }
            soldCount={item.soldCount}
          />
        </List.Item>
      )}
    />
  );
};
