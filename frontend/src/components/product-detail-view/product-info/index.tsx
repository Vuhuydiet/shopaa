import { Card, message } from 'antd';
import { AxiosError } from 'axios';
import { ProductTitle } from './product-title';
import { ProductReview } from './product-review';
import { ProductPrice } from './product-price';
import { ProductColor } from './product-color';
import { ProductSize } from './product-size';
import { ProductButton } from './product-button';
import { useCallback, useMemo, useState } from 'react';
import { useCart } from '../../../service/hooks/useCart';
import { useSelector } from 'react-redux';
import { RootState } from '../../../service/state/store';
import { useNavigate } from 'react-router-dom';
import { ProductQuantity } from './product-quantity';
import { useUser } from '../../../context/UserContext';

export const ProductInfo = () => {
  const [size, setSize] = useState<string>('');
  const [color, setColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const { addItem } = useCart(undefined);
  const product = useSelector((state: RootState) => state.product);
  const [messageApi, messageHolder] = message.useMessage();
  const [isLoadingAddToCart, setIsLoadingAddToCart] = useState(false);
  const { user } = useUser();

  const handleChooseSize = useCallback((e: any) => {
    setSize(e.target.innerText);
  }, []);

  const handleChooseColor = useCallback((e: any) => {
    setColor(e.target.innerText);
  }, []);

  const handleAddToCart = useCallback(
    async (_: any) => {
      setIsLoadingAddToCart(true);

      addItem
        .mutateAsync({
          productId: product.id,
          color: color || undefined,
          size: size || undefined,
        })
        .then(() => {
          messageApi.open({
            type: 'success',
            content: 'Added to cart',
          });

          setIsLoadingAddToCart(false);
        })
        .catch((error: AxiosError) => {
          console.log(error);
          const axiosError = error as AxiosError<{ message: string }>;
          messageApi.open({
            type: 'error',
            content: axiosError.response?.data?.message || 'Add to cart failed',
          });

          setIsLoadingAddToCart(false);
        });
    },
    [product, color, size],
  );
  const navigate = useNavigate();

  const handleCheckout = useCallback(
    (_: any) => {
      if (!user) {
        message.error('Please login to add to cart');
        navigate('/login');
        return;
      }
      if (product.sizes && product.sizes.length > 0 && !size) {
        message.error('Please select a size');
        return;
      }
      if (product.colors && product.colors.length > 0 && !color) {
        message.error('Please select a color');
        return;
      }
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
      {user && user?.role === 'USER' && (
        <>
          <ProductColor currentColor={colorMemo} onClick={handleChooseColor} />
          <ProductSize currentSize={sizeMemo} onClick={handleChooseSize} />
          <ProductQuantity onQuantityChange={(value) => setQuantity(value)} />
          <ProductButton
            addCartLoading={isLoadingAddToCart}
            addCart={handleAddToCart}
            checkout={handleCheckout}
          />
        </>
      )}
    </Card>
  );
};
