import { Typography } from 'antd';
import { ProductCartTable } from '../../components/product-cart-table';
import { ShoppingCartOutlined } from '@ant-design/icons';

export const ProductCart = () => {
  return (
    <div style={{ maxWidth: '1200px' }}>
      <Typography.Title style={{ margin: '10px 0 0 40px', color: 'purple' }}>
        <ShoppingCartOutlined style={{ marginRight: '5px' }} />
        Review Your Cart
      </Typography.Title>
      <ProductCartTable />
    </div>
  );
};
