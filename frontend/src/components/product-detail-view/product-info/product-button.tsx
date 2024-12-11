import { ShoppingCartOutlined } from '@ant-design/icons';
import { Button, Col, Row } from 'antd';
import React from 'react';

export const ProductButton = React.memo(
  ({ addCart }: { addCart: (e: any) => void }) => {
    return (
      <Row style={{ margin: '30px 0 0 40px' }}>
        <Col xs="auto" sm="auto">
          <Button
            icon={<ShoppingCartOutlined />}
            style={{
              width: 'auto',
              marginRight: '30px',
              backgroundColor: '#d2d9ff',
              border: '1px solid blue',
              color: 'blue',
            }}
            onClick={addCart}
          >
            Add Cart
          </Button>
        </Col>
        <Col xs="auto" sm="auto">
          <Button
            type="primary"
            style={{
              width: 'auto',
            }}
          >
            Buy Now
          </Button>
        </Col>
      </Row>
    );
  },
);
