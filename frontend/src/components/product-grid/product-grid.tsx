import { List, Spin } from 'antd';
import { ProductCard } from '../product-card/product-card';
import { IProduct } from '../../interfaces/IProduct';
import { useProducts } from '../../service/hooks/useProducts';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../service/state/store';
import { useEffect } from 'react';
import { setPagination } from '../../service/state/reducers/pagination-reducer';
import { setFilter } from '../../service/state/reducers/filter-reducer';

export const ProductGrid = () => {
  const filters = useSelector((state: RootState) => state.filters);
  const { data: products, isLoading } = useProducts(filters);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setPagination({ currentPage: 1, totalItems: 0 }));
    dispatch(
      setFilter({
        keyword: undefined,
        shopId: undefined,
        category: undefined,
        brand: undefined,
        postedAfter: undefined,
        postedBefore: undefined,
        minPrice: undefined,
        maxPrice: undefined,
        minQuantity: undefined,
        maxQuantity: undefined,
        sortBy: undefined,
        order: undefined,
        offset: 0,
      }),
    );
  }, []);

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
