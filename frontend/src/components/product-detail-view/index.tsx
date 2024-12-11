import './styles.css';
import { Row } from 'antd';
import { ProductImage } from './product-image';
import { ProductInfo } from './product-info';

export const ProductDetailView = () => {
  return (
    <Row
      style={{
        padding: '15px 40px',
        backgroundColor: 'white',
      }}
    >
      <ProductImage />
      <ProductInfo />
    </Row>
  );
};
