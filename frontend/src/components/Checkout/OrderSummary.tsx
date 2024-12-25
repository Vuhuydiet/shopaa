import { List, Row, Col, Typography } from 'antd';

const { Text, Title } = Typography;

export const OrderSummary = ({
  products,
  shippingFee,
}: {
  products: {
    name: string;
    quantity: number;
    price: number;
    color: string;
    size: string;
  }[];
  shippingFee: number;
}) => {
  const totalItemCost = products.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const finalCost = totalItemCost + shippingFee;

  return (
    <>
      <Title level={3}>Order Summary</Title>
      <hr
        style={{
          marginBottom: '15px',
          paddingLeft: '10px',
          paddingRight: '10px',
        }}
      />
      <List
        dataSource={products}
        renderItem={(item) => (
          <List.Item>
            <div style={{ width: '100%' }}>
              <Row justify="space-between" align="middle">
                <Col>
                  <Text strong style={{ fontSize: '1rem' }}>
                    {item.name}
                  </Text>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {item.color && (
                      <Text type="secondary">Color: {item.color}</Text>
                    )}
                    {item.size && (
                      <Text type="secondary">Size: {item.size}</Text>
                    )}
                    {/* <Text type="secondary">Color: {item.color}</Text>
                    <Text type="secondary">Size: {item.size}</Text> */}
                  </div>
                </Col>
                <Col>
                  <Text strong type="secondary" style={{ fontSize: '1rem' }}>
                    x {item.quantity}
                  </Text>
                </Col>
                <Col>
                  <Text strong style={{ fontSize: '1rem' }}>
                    $ {item.price * item.quantity}
                  </Text>
                </Col>
              </Row>
            </div>
          </List.Item>
        )}
      />
      <div
        style={{
          marginTop: 0,
          borderTop: '1px solid #e8e8e8',
          paddingTop: 10,
        }}
      >
        <Row justify="space-between" style={{ marginTop: 30 }}>
          <Col>
            <Text style={{ fontSize: '1rem' }}>Subtotal</Text>
          </Col>
          <Col>
            <Text style={{ fontSize: '1rem' }}>$ {totalItemCost}</Text>
          </Col>
        </Row>
        <Row justify="space-between">
          <Col>
            <Text style={{ fontSize: '1rem' }}>Shipping Fee</Text>
          </Col>
          <Col>
            <Text style={{ fontSize: '1rem' }}>$ {shippingFee}</Text>
          </Col>
        </Row>
        <Row justify="space-between" style={{ marginTop: 10 }}>
          <Col>
            <Title level={4}>Total</Title>
          </Col>
          <Col>
            <Title level={4}>$ {finalCost}</Title>
          </Col>
        </Row>
      </div>
    </>
  );
};
