import { Col } from 'antd';
import { ProductTitle } from './product-title';
import { ProductReview } from './product-review';
import { ProductPrice } from './product-price';
import { ProductColor } from './product-color';
import { ProductSize } from './product-size';
import { ProductQuantity } from './product-quantity';
import { ProductButton } from './product-button';

export const ProductInfo = () => {
  return (
    <Col xs={24} sm={24} md={16} style={{ padding: '10px' }}>
      <ProductTitle />
      <ProductReview />
      <ProductPrice />
      <ProductColor />
      <ProductSize />
      <ProductQuantity />
      <ProductButton />
    </Col>
  );
};
