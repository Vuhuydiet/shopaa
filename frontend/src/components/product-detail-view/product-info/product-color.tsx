import { Button, Col, Row, Typography } from 'antd';
import React from 'react';
import { RootState } from '../../../service/state/store';
import { useSelector } from 'react-redux';

export const ProductColor = React.memo(
  ({
    currentColor,
    onClick,
  }: {
    currentColor: string;
    onClick: (e: any) => void;
  }) => {
    const product = useSelector((state: RootState) => state.product);

    if (!product?.colors || product.colors.length === 0) {
      return null;
    }

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
          <Typography.Text strong>Color</Typography.Text>
        </Col>
        <Col xs={24} sm={20}>
          <Row gutter={[16, 8]} wrap>
            {product?.colors?.map((color: string) => {
              return (
                <Col style={{ width: '100px', display: 'flex' }} key={color}>
                  <Button
                    style={{
                      width: '100%',
                      border: '1px solid black',
                      textAlign: 'center',
                    }}
                    type={color === currentColor ? 'primary' : 'default'}
                    onClick={onClick}
                  >
                    {color}
                  </Button>
                </Col>
              );
            })}
          </Row>
        </Col>
      </Row>
    );
  },
);
