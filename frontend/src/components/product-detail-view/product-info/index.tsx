import { Card, Col, message } from 'antd';
import { ProductTitle } from './product-title';
import { ProductReview } from './product-review';
import { ProductPrice } from './product-price';
import { ProductColor } from './product-color';
import { ProductSize } from './product-size';
import { ProductButton } from './product-button';
import { useCallback, useMemo, useState } from 'react';
import { useCart } from '../../../service/api/useCart';
import { useSelector } from 'react-redux';
import { RootState } from '../../../service/state/store';
import { useNavigate } from 'react-router-dom';

export const ProductInfo = () => {
  const [size, setSize] = useState<string>('');
  const [color, setColor] = useState<string>('');
  const { addItem } = useCart(undefined);
  const product = useSelector((state: RootState) => state.product);
  const [messageApi, messageHolder] = message.useMessage();
  const {
    cart: { refetch },
  } = useCart({ limit: 1, offset: 0 });

  const handleChooseSize = useCallback((e: any) => {
    setSize(e.target.innerText);
  }, []);

  const handleChooseColor = useCallback((e: any) => {
    setColor(e.target.innerText);
  }, []);

  const handleAddToCart = useCallback(
    (e: any) => {
      addItem({
        productId: product.id,
        color: color || undefined,
        size: size || undefined,
      })
        .then(() => {
          messageApi.open({
            type: 'success',
            content: 'Added to cart',
          });
          refetch();
        })
        .catch((error) => {
          console.log(error);
          messageApi.open({
            type: 'error',
            content: error?.response?.data?.message || 'Add to cart failed',
          });
        });
    },
    [product, color, size],
  );
  const navigate = useNavigate();

  const handleCheckout = useCallback(
    (e: any) => {
      const productData = [
        {
          name: product.name,
          id: product.id,
          currentPrice: product.currentPrice,
          size: size || undefined,
          color: color || undefined,
          quantity,
        },
      ];
      console.log('Product Data = buy now: ', productData);

      navigate('/checkout', {
        state: { products: productData },
      });
    },
    [product, size, color, quantity],
  );

  const colorMemo = useMemo(() => color, [color]);
  const sizeMemo = useMemo(() => size, [size]);

  return (
    <Card
      style={{
        marginLeft: '20px',
        border: 'none',
        flex: '1 2 auto',
      }}
    >
      {messageHolder}
      <ProductTitle />
      <ProductReview />
      <ProductPrice />
      <ProductColor currentColor={colorMemo} onClick={handleChooseColor} />
      <ProductSize currentSize={sizeMemo} onClick={handleChooseSize} />
      <ProductQuantity
        quantity={quantityMemo}
        onQuantityChange={(value) => setQuantity(value)}
      />
      <ProductButton addCart={handleAddToCart} checkout={handleCheckout} />
    </Card>
  );
};
