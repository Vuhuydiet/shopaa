import { Button, Card, Col, message, Row, Table, Typography } from 'antd';
import { CartContext } from '../../context/CartContext';
import { useContext } from 'react';
import { CART_PRODUCTS_FILTER } from '../../config/constants';
import { useNavigate } from 'react-router-dom';
import { ShoppingCartOutlined } from '@ant-design/icons';
import { formatCurrency, formatShortenNumber } from '../../utils/format-number';

export const ProductCartTable = () => {
  const {
    shopColumns,
    shopDataState,
    expandTable,
    isLoading,
    totalPrice,
    totalItems,
    setCartParams,
    selectedProducts,
  } = useContext(CartContext);
  const navigate = useNavigate();

  return (
    <Card
      title={
        <Typography.Title
          style={{
            margin: '10px 0 0 40px',
            color: 'purple',
            fontSize: '1.5rem',
          }}
        >
          <ShoppingCartOutlined style={{ marginRight: '5px' }} />
          Your Cart
        </Typography.Title>
      }
      style={{ maxWidth: '900px', margin: '10px auto' }}
    >
      <Table
        loading={isLoading}
        columns={shopColumns}
        dataSource={shopDataState?.cart}
        expandable={expandTable}
        pagination={{
          pageSize: CART_PRODUCTS_FILTER.ITEMS_PER_PAGE,
          onChange(page, pageSize) {
            console.log(page, pageSize);
            setCartParams({
              limit: pageSize,
              offset: (page - 1) * pageSize,
            });
          },
          total: shopDataState?.count,
        }}
      />
      <Col
        span={24}
        style={{ margin: '10px', display: 'flex', justifyContent: 'end' }}
      >
        <Row
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '15px',
          }}
        >
          <Typography.Text strong style={{ color: 'red' }}>
            Total ({formatShortenNumber(totalItems)} items): &nbsp;
            {formatCurrency(totalPrice)}
          </Typography.Text>
          <Button
            style={{ backgroundColor: 'purple', color: 'white' }}
            onClick={() => {
              if (selectedProducts.length === 0) {
                message.warning(
                  'Please select products before proceeding to checkout.',
                );
                return;
              }

              navigate('/checkout', {
                state: { products: selectedProducts },
              });
            }}
          >
            Checkout
          </Button>
        </Row>
      </Col>
    </Card>
  );
};
