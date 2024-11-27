import { ShopOutlined } from '@ant-design/icons';
import { Button, Col, Divider, Row, Space } from 'antd';
import './styles.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../service/state/store';
import { useShop } from '../../service/api/useShop';
import { useUser } from '../../service/api/useUser';

export const StoreInfo = () => {
  const shopId = useSelector((state: RootState) => state.product?.sellerId);
  const { data: seller } = useUser(`${shopId}`);
  const { data: shop } = useShop(`${shopId}`);

  return (
    <Row
      style={{
        backgroundColor: 'white',
        color: 'black',
        display: 'flex',
        alignItems: 'center',
        padding: '20px',
        borderTop: '1px solid lightgray',
      }}
    >
      <Col>
        <img
          src={seller?.avatar?.url}
          alt="avatar"
          style={{ borderRadius: '50%', width: '100px', height: '100px' }}
        />
      </Col>
      <Col style={{ display: 'flex', margin: '0 10px' }}>
        <Space direction="vertical">
          <span style={{ fontWeight: 'bold' }}>{shop?.name}</span>
          <Space direction="horizontal">
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
