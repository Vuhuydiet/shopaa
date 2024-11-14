import { List } from 'antd';
import { ProductCard } from '../product-card/product-card';
import { useSelector } from 'react-redux';
import { RootState } from '../../service/state/store';
import { IProduct } from '../../interfaces/IProduct';

export const ProductGrid = () => {
  const products = useSelector((state: RootState) => state.products.items);

  return (
    <List
      grid={{
        gutter: 16,
        xs: 1,
        sm: 2,
        md: 4,
        lg: 4,
        xl: 6,
        xxl: 3,
      }}
      dataSource={products}
      renderItem={(item: IProduct) => (
        <List.Item>
          <ProductCard
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
