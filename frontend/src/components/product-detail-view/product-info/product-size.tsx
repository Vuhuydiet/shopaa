import { Button, Col, Row, Typography } from 'antd';
import { RootState } from '../../../service/state/store';
import { useSelector } from 'react-redux';
import { memo } from 'react';

export const ProductSize = memo(
  ({
    currentSize,
    onClick,
  }: {
    currentSize: string;
    onClick: (e: any) => void;
  }) => {
    const product = useSelector((state: RootState) => state.product);

    if (!product?.sizes || product.sizes.length === 0) {
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
          <Typography.Text strong>Size</Typography.Text>
        </Col>
        <Col xs={24} sm={20}>
          <Row gutter={[16, 8]} wrap>
            {product?.sizes?.map((size) => (
              <Col style={{ width: '70px', display: 'flex' }} key={size}>
                <Button
                  style={{
                    width: '100%',
                    border: '1px solid black',
                    textAlign: 'center',
                  }}
                  type={size === currentSize ? 'primary' : 'default'}
                  onClick={onClick}
                >
                  {size}
                </Button>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    );
  },
);
