import { Col, message } from 'antd';
import { ProductTitle } from './product-title';
import { ProductReview } from './product-review';
import { ProductPrice } from './product-price';
import { ProductColor } from './product-color';
import { ProductSize } from './product-size';
import { ProductQuantity } from './product-quantity';
import { ProductButton } from './product-button';
import { useCallback, useMemo, useState } from 'react';
import { useCart } from '../../../service/api/useCart';
import { useSelector } from 'react-redux';
import { RootState } from '../../../service/state/store';

export const ProductInfo = () => {
  const [size, setSize] = useState<string>('');
  const [color, setColor] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const { addItem } = useCart(undefined);
  const product = useSelector((state: RootState) => state.product);
  const [messageApi, messageHolder] = message.useMessage();

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

  const colorMemo = useMemo(() => color, [color]);
  const sizeMemo = useMemo(() => size, [size]);
  const quantityMemo = useMemo(() => quantity, [quantity]);

  return (
    <>
      {messageHolder}
      <Col xs={24} sm={24} md={16} style={{ padding: '10px' }}>
        <ProductTitle />
        <ProductReview />
        <ProductPrice />
        <ProductColor currentColor={colorMemo} onClick={handleChooseColor} />
        <ProductSize currentSize={sizeMemo} onClick={handleChooseSize} />
        <ProductQuantity quantity={quantityMemo} />
        <ProductButton addCart={handleAddToCart} />
      </Col>
    </>
  );
};
