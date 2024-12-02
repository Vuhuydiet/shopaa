import { useParams } from 'react-router-dom';
import { Card, Descriptions } from 'antd';

type OrderStatus =
  | 'pending'
  | 'cancelled'
  | 'confirmed'
  | 'shipping'
  | 'delivered'
  | 'returned';

interface Order {
  id: number;
  name: string;
  status: OrderStatus;
}

const mockOrders: Order[] = [
  { id: 1, name: 'Đơn hàng A', status: 'pending' },
  { id: 2, name: 'Đơn hàng B', status: 'cancelled' },
  { id: 3, name: 'Đơn hàng C', status: 'confirmed' },
  { id: 4, name: 'Đơn hàng D', status: 'shipping' },
  { id: 5, name: 'Đơn hàng E', status: 'delivered' },
  { id: 6, name: 'Đơn hàng F', status: 'delivered' },
  { id: 7, name: 'Đơn hàng G', status: 'returned' },
];

const OrderShopDetail = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const order = mockOrders.find((o) => o.id === parseInt(orderId || '', 10));

  if (!order) {
    return <p>Order not found.</p>;
  }

  return (
    <Card style={{ margin: '30px' }}>
      <Descriptions title="Order Details" bordered>
        <Descriptions.Item label="Order ID">{order.id}</Descriptions.Item>
        <Descriptions.Item label="Order Name">{order.name}</Descriptions.Item>
        <Descriptions.Item label="Status">{order.status}</Descriptions.Item>
      </Descriptions>
    </Card>
  );
};

export default OrderShopDetail;
