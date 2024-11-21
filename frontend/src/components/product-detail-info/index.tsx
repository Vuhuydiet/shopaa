import { Col, Row, Space, Typography } from 'antd';

export const ProductDetailInfo = () => {
  return (
    <Space
      style={{
        backgroundColor: 'white',
        color: 'black',
        padding: '20px',
        width: '100%',
        borderTop: '1px solid lightgray',
      }}
      direction="vertical"
      size={12}
    >
      <Row>
        <Typography.Text
          style={{
            backgroundColor: 'lightgray',
            padding: '5px 30px',
            color: 'blue',
            fontWeight: 'bold',
          }}
        >
          Product Detail
        </Typography.Text>
      </Row>

      <Row style={{ marginLeft: '20px' }}>
        <Col style={{ width: '140px' }}>Warehouse</Col>
        <Col>5271</Col>
      </Row>
      <Row style={{ marginLeft: '20px' }}>
        <Col style={{ width: '140px' }}>Brand</Col>
        <Col>Mỹ Diệu Company</Col>
      </Row>
      <Row style={{ marginLeft: '20px' }}>
        <Col style={{ width: '140px' }}>Material</Col>
        <Col>Da, cao su</Col>
      </Row>
      <Row style={{ marginLeft: '20px' }}>
        <Col style={{ width: '140px' }}>Address</Col>
        <Col>Updating</Col>
      </Row>
      <Row style={{ marginLeft: '20px' }}>
        <Col style={{ width: '140px' }}>Origin</Col>
        <Col>China</Col>
      </Row>
    </Space>
  );
};
