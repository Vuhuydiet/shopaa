import './styles.css';
import { Card, Row } from 'antd';
import { ProductImage } from './product-image';
import { ProductInfo } from './product-info';

export const ProductDetailView = () => {
  return (
    <Card style={{ width: '100%' }}>
      <Row
        style={{
          padding: '15px 40px',
          backgroundColor: 'white',
          width: '100%',
          display: 'flex',
        }}
      >
        <ProductImage />
        <ProductInfo />
      </Row>
    </Card>
  );
};
