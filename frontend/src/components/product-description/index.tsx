import { Col, Row, Space, Typography } from 'antd';

export const ProductDescription = () => {
  return (
    <Space
      style={{
        backgroundColor: 'white',
        color: 'black',
        padding: '20px',
        width: '100%',
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
          Product Description
        </Typography.Text>
      </Row>

      <Row style={{ marginLeft: '20px' }}>Dép nữ size từ 35-39</Row>
      <Row style={{ marginLeft: '20px' }}>
        Chân ai gầy, ốm thì đặt lùi 1 size
      </Row>
      <Row style={{ marginLeft: '20px' }}>Hàng cao cấp đế 4 cm</Row>
      <Row style={{ marginLeft: '20px' }}>
        Hàng thời trang cao cấp mới nhất 2024
      </Row>
      <Row style={{ marginLeft: '20px' }}>Hộp fullbox xịn xò</Row>
    </Space>
  );
};
