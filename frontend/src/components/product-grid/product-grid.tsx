import { List, Spin } from 'antd';
import { ProductCard } from '../product-card/product-card';
import { IProduct } from '../../interfaces/IProduct';
import { useProducts } from '../../service/api/useProducts';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../service/state/store';
import { useEffect } from 'react';
import { setPagination } from '../../service/state/slices/pagination-slice';

export const ProductGrid = () => {
  const filters = useSelector((state: RootState) => state.filters);
  const { data: products, isLoading } = useProducts(filters);
  const dispatch = useDispatch();

  useEffect(() => {
    if (products?.count) {
      dispatch(setPagination({ totalItems: products?.count }));
    } else {
      dispatch(setPagination({ totalItems: 0 }));
    }
  }, [products]);

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
      dataSource={products?.items}
      renderItem={(item: IProduct) => (
        <List.Item>
          <ProductCard
            id={item.id}
            image={item.images[0]?.url || ''}
            title={item.name}
            originalPrice={item.originalPrice}
            currentPrice={item.currentPrice}
            star={4.7}
            soldCount={item.soldCount}
          />
        </List.Item>
      )}
    />
  );
};
