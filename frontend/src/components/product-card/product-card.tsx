import { Button, Card, Space, Typography } from 'antd';
import { IProductCard } from '../../interfaces/IProductCard';
import { ShoppingCartOutlined, StarFilled } from '@ant-design/icons';
import numberAbbreviation from '../../utils/number-abbreviation';

export const ProductCard = (product: IProductCard) => {
  return (
    <Card>
      <Card.Meta
        title={
          <img
            src={product.image}
            alt={product.title}
            style={{ width: '100%' }}
          />
        }
      />

      <Typography.Title level={4}>{product.title}</Typography.Title>
      <Typography.Text
        delete
        style={{ fontSize: '0.8rem', margin: '0 20px 0 0' }}
      >
        $ {product.originalPrice}
      </Typography.Text>
      <Typography.Text style={{ color: 'red', fontSize: '1.2rem' }} italic>
        $ {product.currentPrice}
      </Typography.Text>
      <Space
        direction="horizontal"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Typography.Text strong>
          <StarFilled style={{ margin: '0 3px 0 0', color: 'yellow' }} />
          {product.star}
        </Typography.Text>
        <Typography.Text italic strong>
          {numberAbbreviation(product.soldCount)} sales
        </Typography.Text>
        <Button
          style={{
            backgroundColor: 'red',
            borderRadius: '50%',
            color: 'white',
            padding: '20px',
          }}
          icon={<ShoppingCartOutlined style={{ fontSize: '1.3rem' }} />}
        />
      </Space>
    </Card>
  );
};
