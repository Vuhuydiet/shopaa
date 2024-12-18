import { Button, Col, Row, Table, Typography } from 'antd';
import { CartContext } from '../../context/CartContext';
import { useContext } from 'react';
import { CART_PRODUCTS_FILTER } from '../../config/constants';
import { useNavigate } from 'react-router-dom';

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
    <>
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
            Total ({totalItems} items): ${totalPrice}
          </Typography.Text>
          <Button
            style={{ backgroundColor: 'purple', color: 'white' }}
            onClick={() => {
              navigate('/checkout', {
                state: { products: selectedProducts },
              });
            }}
          >
            Checkout
          </Button>
        </Row>
      </Col>
    </>
  );
};
