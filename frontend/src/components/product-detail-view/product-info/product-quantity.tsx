import { Col, InputNumber, Row, Typography } from 'antd';
import React from 'react';

export const ProductQuantity = React.memo(
  ({ onQuantityChange }: { onQuantityChange: (value: number) => void }) => {
    return (
      <Row style={{ marginTop: '30px', display: 'flex', alignItems: 'center' }}>
        <Col
          xs={24}
          sm={4}
          style={{
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Typography.Text>Quantity</Typography.Text>
        </Col>
        <Col xs={24} sm={20}>
          <Row gutter={[8, 8]} wrap>
            <Col>
              <InputNumber
                min={1}
                defaultValue={1}
                onChange={(value) => {
                  if (!value) return;
                  if (value) {
                    onQuantityChange(value);
                  }
                }}
              />
            </Col>
          </Row>
        </Col>
      </Row>
    );
  },
);
