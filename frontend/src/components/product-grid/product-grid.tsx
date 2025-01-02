import { List, Spin } from 'antd';
import { ProductCard } from '../product-card/product-card';
import { IProduct } from '../../interfaces/IProduct';
import { useSelector } from 'react-redux';
import { RootState } from '../../service/state/store';

export const ProductGrid = () => {
  const { products, isLoading } = useSelector(
    (state: RootState) => state.filters,
  );

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
