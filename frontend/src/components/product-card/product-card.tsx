import './styles.css';
import { Button, Card, Space, Typography } from 'antd';
import { IProductCard } from '../../interfaces/IProductCard';
import { ShoppingCartOutlined, StarFilled } from '@ant-design/icons';
import numberAbbreviation from '../../utils/number-abbreviation';
import { useNavigate } from 'react-router-dom';
import { memo } from 'react';

export const ProductCard = memo((product: IProductCard) => {
  const navigate = useNavigate();

  const handleClickCard = () => {
    navigate(`/product-detail/${product.id}`);
  };

  return (
    <Card
      style={{ maxWidth: '230px', margin: 'auto' }}
      hoverable
      onClick={handleClickCard}
      className="product-card"
    >
      <Card.Meta
        title={
          <img
            src={
              product.image ||
              'data:image/jpeg;base64,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'
            }
            alt={product.title}
            style={{ width: '100%', height: '150px', objectFit: 'cover' }}
            className="product-card-image"
          />
        }
      />
      <Typography.Title level={5} ellipsis>
        {product.title}
      </Typography.Title>
      <Typography.Text
        delete
        style={{ fontSize: '0.8rem', margin: '0 20px 0 0' }}
      >
        $ {product.originalPrice}
      </Typography.Text>
      <Typography.Text style={{ color: 'red', fontSize: '1rem' }} italic>
        $ {product.currentPrice}
      </Typography.Text>
      <div style={{ marginTop: '5px' }}>
        <Typography.Text style={{ fontSize: '0.8rem', color: 'blue' }}>
          <span>Quantity:</span> {product.quantity}
        </Typography.Text>
      </div>
      <Space
        direction="horizontal"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
        size={0}
      >
        <Typography.Text strong style={{ fontSize: '0.7rem' }}>
          <StarFilled style={{ margin: '0 3px 0 0', color: 'yellow' }} />
          {product.star}
        </Typography.Text>
        <Typography.Text italic strong style={{ fontSize: '0.7rem' }}>
          {numberAbbreviation(product.soldCount)} sales
        </Typography.Text>
      </Space>
    </Card>
  );
});
