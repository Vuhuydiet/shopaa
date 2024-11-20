import { MessageOutlined, ShopOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Row, Space } from 'antd';
import './styles.css';

export const StoreInfo = () => {
  return (
    <Row
      style={{
        backgroundColor: 'white',
        color: 'black',
        display: 'flex',
        alignItems: 'center',
      }}
    >
      <Col>
        <img
          src="https://down-vn.img.susercontent.com/file/2060dc60cb0367043dccacc664c13030@resize_w160_nl.webp"
          alt="avatar"
          style={{ borderRadius: '50%', width: '100px', height: '100px' }}
        />
      </Col>
      <Col style={{ display: 'flex', margin: '0 10px' }}>
        <Space direction="vertical">
          <span style={{ fontWeight: 'bold' }}>tongkhogiaydep88</span>
          <span style={{ fontStyle: 'italic', color: 'gray' }}>
            Online 7 phút trước
          </span>
          <Space direction="horizontal">
            <Button
              icon={<MessageOutlined />}
              style={{
                color: 'orange',
                border: '1px solid orange',
                backgroundColor: '#FFEEE8',
              }}
            >
              Chat Ngay
            </Button>
            <Button icon={<ShopOutlined />} style={{ color: 'gray' }}>
              Xem Shop
            </Button>
          </Space>
        </Space>
      </Col>
      <Divider
        type="vertical"
        style={{ height: '5rem' }}
        className="divider-shop-info"
      />
      <Col flex={1} style={{ marginRight: '5px' }}>
        <Space
          direction="vertical"
          style={{ width: '100%', marginLeft: '10px' }}
        >
          <Row>
            <Col style={{ width: '100px', fontWeight: 'bold' }}>Review</Col>
            <Col style={{ color: 'blue' }}>72.9k</Col>
          </Row>
          <Row>
            <Col style={{ width: '100px', fontWeight: 'bold' }}>Product</Col>
            <Col style={{ color: 'blue' }}>266</Col>
          </Row>
        </Space>
      </Col>
    </Row>
  );
};
