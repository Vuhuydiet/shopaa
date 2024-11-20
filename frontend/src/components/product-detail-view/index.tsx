import {
  LeftOutlined,
  RightOutlined,
  ShoppingCartOutlined,
} from '@ant-design/icons';
import {
  Button,
  Carousel,
  Col,
  Divider,
  InputNumber,
  Rate,
  Row,
  Typography,
} from 'antd';
import './styles.css';

const CustomPrevArrow = (props: any) => (
  <div
    className="custom-arrow prev"
    onClick={props.onClick}
    style={{
      position: 'absolute',
      left: '-15px', // Move further left
      top: '54%',
      transform: 'translateY(-50%)',
      zIndex: 2,
      cursor: 'pointer',
    }}
  >
    <LeftOutlined
      className="arrow-prev"
      style={{ fontSize: '1rem', color: '#000' }}
    />
  </div>
);

const CustomNextArrow = (props: any) => (
  <div
    className="custom-arrow next"
    onClick={props.onClick}
    style={{
      position: 'absolute',
      right: '-15px', // Move further right
      top: '54%',
      transform: 'translateY(-50%)',
      zIndex: 2,
      cursor: 'pointer',
    }}
  >
    <RightOutlined className="arrow-next" />
  </div>
);

export const ProductDetailView = () => {
  // useEffect(() => {
  //   const fetchProduct = async () => {
  //     const res = await axios.get(`${PRODUCT_API_ENDPOINTS.PRODUCTS}/370`);
  //     console.log(res?.data?.metadata?.product);
  //   };
  //   fetchProduct();
  // }, []);

  return (
    <Row
      gutter={[16, 16]}
      style={{
        padding: '15px',
        backgroundColor: 'white',
      }}
    >
      <Col xs={24} sm={24} md={8}>
        <img
          src="https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lxvc2avdjgexb5@resize_w900_nl.webp"
          alt="product image"
          style={{ width: '100%', maxHeight: '400px', objectFit: 'contain' }}
        />
        <Carousel
          arrows={true}
          infinite={true}
          prevArrow={<CustomPrevArrow />}
          nextArrow={<CustomNextArrow />}
        >
          <div>
            <Row gutter={[8, 8]} justify="space-between">
              <Col xs={6}>
                <img
                  src="https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lxvc2avdjgexb5@resize_w900_nl.webp"
                  alt="product thumbnail"
                  style={{ width: '100%' }}
                />
              </Col>
              <Col xs={6}>
                <img
                  src="https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lxvc2avdjgexb5@resize_w900_nl.webp"
                  alt="product thumbnail"
                  style={{ width: '100%' }}
                />
              </Col>
              <Col xs={6}>
                <img
                  src="https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lxvc2avdjgexb5@resize_w900_nl.webp"
                  alt="product thumbnail"
                  style={{ width: '100%' }}
                />
              </Col>
              <Col xs={6}>
                <img
                  src="https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lxvc2avdjgexb5@resize_w900_nl.webp"
                  alt="product thumbnail"
                  style={{ width: '100%' }}
                />
              </Col>
            </Row>
          </div>
          <div>
            <Row gutter={[8, 8]} justify="space-between">
              <Col xs={6}>
                <img
                  src="https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lxvc2avdjgexb5@resize_w900_nl.webp"
                  alt="product thumbnail"
                  style={{ width: '100%' }}
                />
              </Col>
              <Col xs={6}>
                <img
                  src="https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lxvc2avdjgexb5@resize_w900_nl.webp"
                  alt="product thumbnail"
                  style={{ width: '100%' }}
                />
              </Col>
              <Col xs={6}>
                <img
                  src="https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lxvc2avdjgexb5@resize_w900_nl.webp"
                  alt="product thumbnail"
                  style={{ width: '100%' }}
                />
              </Col>
              <Col xs={6}>
                <img
                  src="https://down-vn.img.susercontent.com/file/vn-11134207-7r98o-lxvc2avdjgexb5@resize_w900_nl.webp"
                  alt="product thumbnail"
                  style={{ width: '100%' }}
                />
              </Col>
            </Row>
          </div>
        </Carousel>
      </Col>

      <Col xs={24} sm={24} md={16}>
        <Row gutter={[8, 8]} style={{ display: 'flex', alignItems: 'center' }}>
          <Col>
            <Typography.Text
              strong
              style={{
                fontSize: '0.7rem',
                padding: '5px',
                backgroundColor: 'purple',
                color: 'white',
                margin: '0 10px 0 0',
              }}
            >
              Yêu thích
            </Typography.Text>
          </Col>
          <Col>
            <Typography.Title
              level={4}
              style={{
                margin: 'auto 0',
                fontSize: '1.2rem',
              }}
            >
              Product Title
            </Typography.Title>
          </Col>
        </Row>

        <Row
          gutter={[8, 8]}
          style={{ display: 'flex', alignItems: 'center', marginTop: '5px' }}
        >
          <Typography.Text
            strong
            style={{ fontSize: '0.8rem', margin: '0 5px 0 5px' }}
          >
            4.7
          </Typography.Text>
          <Rate
            disabled
            defaultValue={4.7}
            allowHalf
            style={{ fontSize: '0.8rem' }}
          />
          <Divider type="vertical" style={{ height: '20px' }} />
          <Typography.Text strong italic style={{ fontSize: '0.8rem' }}>
            3.6k reviews
          </Typography.Text>
          <Divider type="vertical" style={{ height: '20px' }} />
          <Typography.Text strong italic style={{ fontSize: '0.8rem' }}>
            12.2k sales
          </Typography.Text>
        </Row>

        <Row
          style={{
            backgroundColor: 'lightgray',
            margin: '10px 0',
            width: '40%',
            padding: '5px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-evenly',
          }}
        >
          <Col>
            <Typography.Text
              strong
              italic
              style={{
                fontSize: '1rem',
                color: 'red',
              }}
            >
              $5
            </Typography.Text>
          </Col>
          <Col>
            <Typography.Text
              italic
              delete
              style={{
                fontSize: '0.6rem',
                color: 'gray',
              }}
            >
              $10
            </Typography.Text>
          </Col>
        </Row>

        <Row style={{ marginTop: '30px' }}>
          <Col
            xs={24}
            sm={4}
            style={{
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Typography.Text>Color</Typography.Text>
          </Col>
          <Col xs={24} sm={20}>
            <Row gutter={[16, 8]} wrap>
              <Col style={{ width: '100px', display: 'flex' }}>
                <Typography.Text
                  style={{
                    width: '100%',
                    border: '1px solid black',
                    textAlign: 'center',
                  }}
                >
                  Black
                </Typography.Text>
              </Col>
            </Row>
          </Col>
        </Row>

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
              <Col style={{ width: '70px', display: 'flex' }}>
                <Typography.Text
                  style={{
                    width: '100%',
                    border: '1px solid black',
                    textAlign: 'center',
                  }}
                >
                  34
                </Typography.Text>
              </Col>
            </Row>
          </Col>
        </Row>

        <Row
          style={{ marginTop: '30px', display: 'flex', alignItems: 'center' }}
        >
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
                <InputNumber min={1} defaultValue={1} />
              </Col>
            </Row>
          </Col>
        </Row>

        <Row style={{ margin: '30px 0 0 40px' }}>
          <Col xs="auto" sm="auto">
            <Button
              icon={<ShoppingCartOutlined />}
              style={{
                width: 'auto',
                marginRight: '30px',
                backgroundColor: '#d2d9ff',
                border: '1px solid blue',
                color: 'blue',
              }}
            >
              Add Cart
            </Button>
          </Col>
          <Col xs="auto" sm="auto">
            <Button
              type="primary"
              style={{
                width: 'auto',
              }}
            >
              Buy Now
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};
