import { Col, Row, Typography } from 'antd';
import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../../service/state/store';

export const ProductTitle = React.memo(() => {
  const product = useSelector((state: RootState) => state.product);

  return (
    <Row gutter={[8, 8]} style={{ display: 'flex', alignItems: 'center' }}>
      <Col>
        <Typography.Text
          strong
          style={{
            fontSize: '0.7rem',
            padding: '5px',
            backgroundColor: 'purple',
            color: 'white',
            margin: '0 10px 0 0',
          }}
        >
          Hot
        </Typography.Text>
      </Col>
      <Col>
        <Typography.Title
          level={4}
          style={{
            margin: 'auto 0',
            fontSize: '1.2rem',
          }}
        >
          {product?.name}
        </Typography.Title>
      </Col>
    </Row>
  );
});
