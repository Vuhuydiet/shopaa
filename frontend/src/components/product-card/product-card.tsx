import { Button, Space, Typography } from 'antd';
import { IProductCard } from '../../interfaces/IProductCard';
import { ShoppingCartOutlined, StarFilled } from '@ant-design/icons';
import numberAbbreviation from '../../utils/number-abbreviation';

export const ProductCard = (product: IProductCard) => {
  return (
    <Space
      direction="vertical"
      size={2}
      style={{ backgroundColor: 'white', margin: '30px' }}
    >
      <img
        src={product.image}
        alt={product.title}
        style={{ margin: '20px 20px 0 20px' }}
      />
      <Typography.Title level={4} style={{ margin: '0 0 20px 20px' }}>
        {product.title}
      </Typography.Title>
      <Typography.Text
        delete
        style={{ margin: '0 0 0 20px', fontSize: '0.8rem' }}
      >
        $ {product.originPrice}
      </Typography.Text>
      <Typography.Text
        style={{ margin: '0 0 0 20px', color: 'red', fontSize: '1.2rem' }}
        italic
      >
        $ {product.salePrice}
      </Typography.Text>
      <Space
        direction="horizontal"
        style={{
          margin: '0 20px 20px 20px',
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <Typography.Text strong>
          <StarFilled style={{ margin: '0 3px 0 0', color: 'yellow' }} />
          {product.star}
        </Typography.Text>
        <Typography.Text italic strong>
          {numberAbbreviation(product.bought)} sales
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
    </Space>
  );
};
