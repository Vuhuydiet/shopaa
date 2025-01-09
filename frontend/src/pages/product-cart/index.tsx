import { ProductCartTable } from '../../components/product-cart-table';
import { CartProvider } from '../../context/CartContext';

export const ProductCart = () => {
  return (
    <CartProvider>
      <div style={{ maxWidth: '1200px' }}>
        <ProductCartTable />
      </div>
    </CartProvider>
  );
};
