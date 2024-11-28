import { Col, Row, Typography } from 'antd';
import { RootState } from '../../../service/state/store';
import { useSelector } from 'react-redux';

export const ProductSize = () => {
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
        <Typography.Text>Size</Typography.Text>
      </Col>
      <Col xs={24} sm={20}>
        <Row gutter={[16, 8]} wrap>
          {product?.sizes?.map((size) => (
            <Col style={{ width: '70px', display: 'flex' }} key={size}>
              <Typography.Text
                style={{
                  width: '100%',
                  border: '1px solid black',
                  textAlign: 'center',
                }}
              >
                {size}
              </Typography.Text>
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  );
};
