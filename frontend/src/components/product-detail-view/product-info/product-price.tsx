import { Col, Row, Typography } from 'antd';
import React from 'react';
import { RootState } from '../../../service/state/store';
import { useSelector } from 'react-redux';

export const ProductPrice = React.memo(() => {
  const product = useSelector((state: RootState) => state.product);

  return (
    <Row
      style={{
        backgroundColor: 'lightgray',
        margin: '10px 0',
        width: '40%',
        padding: '5px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-evenly',
      }}
    >
      <Col>
        <Typography.Text
          strong
          italic
          style={{
            fontSize: '1rem',
            color: 'red',
          }}
        >
          ${product.currentPrice}
        </Typography.Text>
      </Col>
      <Col>
        <Typography.Text
          italic
          delete
          style={{
            fontSize: '0.6rem',
            color: 'gray',
          }}
        >
          ${product.originalPrice}
        </Typography.Text>
      </Col>
    </Row>
  );
});
