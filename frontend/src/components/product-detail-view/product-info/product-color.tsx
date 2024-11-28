import { Col, Row, Typography } from 'antd';
import React from 'react';
import { RootState } from '../../../service/state/store';
import { useSelector } from 'react-redux';

export const ProductColor = React.memo(() => {
  const product = useSelector((state: RootState) => state.product);

  return (
    <Row style={{ marginTop: '30px' }}>
      <Col
        xs={24}
        sm={4}
        style={{
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Typography.Text>Color</Typography.Text>
      </Col>
      <Col xs={24} sm={20}>
        <Row gutter={[16, 8]} wrap>
          {product?.colors?.map((color: string) => {
            return (
              <Col style={{ width: '100px', display: 'flex' }} key={color}>
                <Typography.Text
                  style={{
                    width: '100%',
                    border: '1px solid black',
                    textAlign: 'center',
                  }}
                >
                  {color}
                </Typography.Text>
              </Col>
            );
          })}
        </Row>
      </Col>
    </Row>
  );
});
