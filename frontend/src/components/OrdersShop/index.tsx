import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Table, Tag, Button, Space, Dropdown } from 'antd';
import { NavLink } from 'react-router-dom';
import { EditOutlined } from '@ant-design/icons';
import { IQueryOrder } from '../../interfaces/IQueryOrder';
import axios from 'axios';
import { ORDER_API_ENDPOINTS } from '../../config/API_config';
import { IOrder } from '../../interfaces/IOrder';

type OrderStatus =
  | 'pending'
  | 'cancelled'
  | 'confirmed'
  | 'shipping'
  | 'delivered'
  | 'returned';

interface Order {
  orderId: number;
  customerName: string;
  phoneNumber: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
}
async function getOrders(params: IQueryOrder = { limit: 10 }, token: string) {
  try {
    const response = await axios.get(ORDER_API_ENDPOINTS.ORDER, {
      params: params,
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });
    console.log(response);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}

const OrderShop: React.FC = () => {
  useEffect(() => {
    const params = {
      shopId: 9,
    };
    getOrders(params, localStorage.getItem('token') || '');
  }, []);
  const [currentStatus, setCurrentStatus] = useState<string>('all');
  const [orders, setOrders] = useState<Order[]>([
    {
      orderId: 1,
      customerName: 'Nguyễn Văn A',
      phoneNumber: '0123456789',
      status: 'pending',
      totalAmount: 200,
      createdAt: '2024-12-01 10:30',
    },
    {
      orderId: 2,
      customerName: 'Trần Thị B',
      phoneNumber: '0987654321',
      status: 'confirmed',
      totalAmount: 300,
      createdAt: '2024-12-01 15:45',
    },
    {
      orderId: 3,
      customerName: 'Trần Thị B',
      phoneNumber: '0987654321',
      status: 'delivered',
      totalAmount: 300,
      createdAt: '2024-12-01 15:45',
    },
    {
      orderId: 4,
      customerName: 'Trần Thị B',
      phoneNumber: '0987654321',
      status: 'pending',
      totalAmount: 300,
      createdAt: '2024-12-01 15:45',
    },
    {
      orderId: 5,
      customerName: 'Trần Thị B',
      phoneNumber: '0987654321',
      status: 'pending',
      totalAmount: 300,
      createdAt: '2024-12-01 15:45',
    },
    {
      orderId: 6,
      customerName: 'Trần Thị B',
      phoneNumber: '0987654321',
      status: 'pending',
      totalAmount: 300,
      createdAt: '2024-12-01 15:45',
    },
  ]);

  const navigate = useNavigate();

  const statusMapping: Record<OrderStatus, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    shipping: 'Shipping',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
    returned: 'Returned',
  };

  const menuItems = [
    { key: 'all', label: 'All' },
    ...Object.keys(statusMapping).map((status) => ({
      key: status,
      label: statusMapping[status as OrderStatus],
    })),
  ];

  const filteredOrders =
    currentStatus === 'all'
      ? orders
      : orders.filter((order) => order.status === currentStatus);

  const handleStatusChange = (orderId: number, newStatus: OrderStatus) => {
    setOrders((prevOrders) =>
      prevOrders.map((order) =>
        order.orderId === orderId ? { ...order, status: newStatus } : order,
      ),
    );
  };

  const columns = [
    {
      title: '#',
      render: (_: any, __: Order, index: number) => index + 1,
      key: 'index',
    },
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
    },
    {
      title: 'Customer name',
      dataIndex: 'customerName',
      key: 'customerName',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: OrderStatus, record: Order) =>
        status === 'pending' ? (
          <Dropdown
            menu={{
              items: [
                {
                  key: 'confirm',
                  label: 'Confirm',
                  onClick: () =>
                    handleStatusChange(record.orderId, 'confirmed'),
                },
                {
                  key: 'cancel',
                  label: 'Cancel',
                  onClick: () =>
                    handleStatusChange(record.orderId, 'cancelled'),
                },
              ],
            }}
          >
            <span
              onClick={() => {}}
              style={{
                padding: 0,
                border: 'none',
                background: 'none',
                display: 'inline-block',
                cursor: 'pointer',
              }}
            >
              <Tag color={getStatusColor(status)}>{statusMapping[status]}</Tag>
              <EditOutlined style={{ marginLeft: '3px' }} />
            </span>
          </Dropdown>
        ) : (
          <Tag color={getStatusColor(status)}>{statusMapping[status]}</Tag>
        ),
    },
    {
      title: 'Total amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount: number) => `$${amount.toFixed(2)}`,
    },
    {
      title: 'Time',
      dataIndex: 'createdAt',
      key: 'createdAt',
    },
    {
      title: 'Action',
      key: 'action',
      render: (record: Order) => (
        <Space size="middle">
          <Button type="primary">
            <NavLink to={`/manager-shop/list-order/${record.orderId}`}>
              Detail
            </NavLink>
          </Button>
        </Space>
      ),
    },
  ];

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'pending':
        return 'orange';
      case 'cancelled':
        return 'red';
      case 'confirmed':
        return 'blue';
      case 'shipping':
        return 'cyan';
      case 'delivered':
        return 'green';
      case 'returned':
        return 'magenta';
      default:
        return 'gray';
    }
  };

  return (
    <>
      <div style={{ padding: '30px', color: 'black' }}>
        <h1
          style={{
            textAlign: 'left',
            marginLeft: '10px',
            marginBottom: '10px',
          }}
        >
          List order
        </h1>
        <hr />
        <div style={{ marginTop: '40px' }}>
          <Menu
            mode="horizontal"
            selectedKeys={[currentStatus]}
            onClick={(e) => setCurrentStatus(e.key)}
            items={menuItems}
          />
          <Table
            dataSource={filteredOrders}
            columns={columns}
            rowKey="orderId"
            style={{ marginTop: '16px' }}
          />
        </div>
      </div>
    </>
  );
};

export default OrderShop;
