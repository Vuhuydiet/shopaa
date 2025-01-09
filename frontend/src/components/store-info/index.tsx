import { ShopOutlined } from '@ant-design/icons';
import { Button, Card, Col, Divider, Rate, Row, Space, Image } from 'antd';
import './styles.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../service/state/store';
import { useShop } from '../../service/hooks/useShop';
import { useUser } from '../../service/hooks/useUser';
import { useNavigate } from 'react-router-dom';
import { useMemo } from 'react';

export const StoreInfo = () => {
  const shopId = useSelector((state: RootState) => state.product?.sellerId);
  const { data: seller } = useUser(`${shopId}`);
  const { data: shop } = useShop(`${shopId}`);
  const navigate = useNavigate();

  const averageRate = useMemo(() => {
    return shop?.totalRating && shop?.numReviews
      ? parseFloat(Number(shop?.totalRating / shop?.numReviews).toFixed(1))
      : 0;
  }, [shop]);

  return (
    <Card style={{ marginTop: '20px' }}>
      <Row
        style={{
          backgroundColor: 'white',
          color: 'black',
          display: 'flex',
          alignItems: 'center',
          padding: '15px 40px',
        }}
      >
        <Col>
          <Image
            src={
              seller?.avatar?.url ??
              'https://res.cloudinary.com/dwkunsgly/image/upload/v1736347325/brzw7ubnc2fnaxwlpas1.jpg'
            }
            alt="avatar"
            style={{ borderRadius: '50%', height: '80px', width: '80px' }}
          />
        </Col>
        <Col style={{ display: 'flex', margin: '0 20px' }}>
          <Space direction="vertical">
            <span style={{ fontWeight: 'bold' }}>{shop?.name}</span>
            <Space direction="horizontal">
              <Button
                icon={<ShopOutlined />}
                style={{ color: 'gray' }}
                onClick={() => navigate(`/shop/${shopId}`)}
              >
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
        <Col
          style={{
            display: 'flex',
            flexDirection: 'column',
            marginLeft: '20px',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <span style={{ fontSize: '1.6rem', fontWeight: 'bold' }}>
            {averageRate}
          </span>
          <Rate value={averageRate} allowHalf disabled />
        </Col>
        <Col flex={1} style={{ marginLeft: '40px' }}>
          <Space
            direction="horizontal"
            size={48}
            style={{ width: '100%', marginLeft: '20px' }}
          >
            <Row>
              <span style={{ fontWeight: 'bold', marginRight: '10px' }}>
                Review
              </span>
              <span style={{ color: 'blue' }}>{shop?.numReviews}</span>
            </Row>
            <Row>
              <span style={{ fontWeight: 'bold', marginRight: '10px' }}>
                Product
              </span>
              <span style={{ color: 'blue' }}>{shop?.numProducts}</span>
            </Row>
            <Row>
              <span style={{ fontWeight: 'bold', marginRight: '10px' }}>
                Sold Orders
              </span>
              <span style={{ color: 'blue' }}>{shop?.numSoldOrders}</span>
            </Row>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};
