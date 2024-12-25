import { Col, Row, Space, Typography } from 'antd';
import { RootState } from '../../service/state/store';
import { useSelector } from 'react-redux';

export const ProductDetailInfo = () => {
  const product = useSelector((state: RootState) => state.product);

  return (
    <Space
      style={{
        backgroundColor: 'white',
        color: 'black',
        padding: '15px 40px',
        width: '100%',
      }}
      direction="vertical"
      size={12}
    >
      <Row>
        <Typography.Text
          style={{
            padding: '5px 30px',
            color: 'gray',
            fontWeight: 'bold',
            fontSize: '1.3rem',
          }}
        >
          Product Detail
        </Typography.Text>
      </Row>

      <Row style={{ marginLeft: '20px' }}>
        <Col style={{ width: '140px' }}>Warehouse</Col>
        <Col>{product?.quantity}</Col>
      </Row>
      <Row style={{ marginLeft: '20px' }}>
        <Col style={{ width: '140px' }}>Brand</Col>
        <Col>{product?.brand}</Col>
      </Row>
      <Row style={{ marginLeft: '20px' }}>
        <Col style={{ width: '140px' }}>Material</Col>
        <Col>{product?.material}</Col>
      </Row>
      <Row style={{ marginLeft: '20px' }}>
        <Col style={{ width: '140px' }}>Origin</Col>
        <Col>{product?.origin}</Col>
      </Row>
    </Space>
  );
};
