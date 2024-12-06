import { Typography } from 'antd';
import { ProductCartTable } from '../../components/product-cart-table';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { CartProvider } from '../../context/CartContext';

export const ProductCart = () => {
  return (
    <CartProvider>
      <div style={{ maxWidth: '1200px' }}>
        <Typography.Title style={{ margin: '10px 0 0 40px', color: 'purple' }}>
          <ShoppingCartOutlined style={{ marginRight: '5px' }} />
          Your Cart
        </Typography.Title>
        <ProductCartTable />
      </div>
    </CartProvider>
  );
};
