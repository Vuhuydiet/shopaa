import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Button, Table, Tag, Dropdown, Menu, message } from 'antd';

interface OrderDetail {
  productId: number;
  productName: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
}

interface Order {
  orderId: number;
  customerName: string;
  phoneNumber: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  orderDetails: OrderDetail[];
}

const OrderShopDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    const fetchedOrder: Order = {
      orderId: Number(orderId),
      customerName: 'Nguyễn Văn A',
      phoneNumber: '0123456789',
      status: 'Pending',
      totalAmount: 200,
      createdAt: '2024-12-01 10:30',
      orderDetails: [
        {
          productId: 1,
          productName: 'Áo thun nam',
          color: 'Đỏ',
          size: 'M',
          quantity: 2,
          price: 50,
        },
        {
          productId: 2,
          productName: 'Quần jeans',
          color: 'Xanh',
          size: 'L',
          quantity: 1,
          price: 100,
        },
      ],
    };
    setOrder(fetchedOrder);
  }, [orderId]);

  const handleStatusChange = (newStatus: string) => {
    if (order) {
      setOrder({
        ...order,
        status: newStatus,
      });
      message.success(`Update status successful: ${newStatus}`);
    }
  };

  const statusMenu = (
    <Menu>
      <Menu.Item onClick={() => handleStatusChange('Confirmed')}>
        Confirm
      </Menu.Item>
      <Menu.Item onClick={() => handleStatusChange('Shipping')}>
        Shipping
      </Menu.Item>
      <Menu.Item onClick={() => handleStatusChange('Cancelled')}>
        Cancel
      </Menu.Item>
      <Menu.Item onClick={() => handleStatusChange('Delivered')}>
        Delivered
      </Menu.Item>
    </Menu>
  );

  const columns = [
    {
      title: 'Product name',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'Colors',
      dataIndex: 'color',
      key: 'color',
    },
    {
      title: 'Sizes',
      dataIndex: 'size',
      key: 'size',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `$${price.toFixed(2)}`,
    },
    {
      title: 'Total',
      key: 'total',
      render: (_: any, record: OrderDetail) =>
        `$${(record.price * record.quantity).toFixed(2)}`,
    },
  ];

  if (!order) {
    return <div>Loading...</div>;
  }

  return (
    <div style={{ padding: '30px', color: 'black' }}>
      <h1>Order detail {order.orderId}</h1>
      <hr />
      <div style={{ marginTop: '40px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td
                style={{ padding: '8px', fontWeight: 'bold', width: '150px' }}
              >
                Customer:
              </td>
              <td style={{ padding: '8px' }}>{order.customerName}</td>
            </tr>
            <tr>
              <td
                style={{ padding: '8px', fontWeight: 'bold', width: '150px' }}
              >
                Phone:
              </td>
              <td style={{ padding: '8px' }}>{order.phoneNumber}</td>
            </tr>
            <tr>
              <td
                style={{ padding: '8px', fontWeight: 'bold', width: '150px' }}
              >
                Status:
              </td>
              <td style={{ padding: '8px' }}>
                <Tag color="orange">{order.status}</Tag>
              </td>
            </tr>
            <tr>
              <td
                style={{ padding: '8px', fontWeight: 'bold', width: '150px' }}
              >
                Total amount:
              </td>
              <td style={{ padding: '8px' }}>
                ${order.totalAmount.toFixed(2)}
              </td>
            </tr>
            <tr>
              <td
                style={{ padding: '8px', fontWeight: 'bold', width: '150px' }}
              >
                Time:
              </td>
              <td style={{ padding: '8px' }}>{order.createdAt}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <Table
        dataSource={order.orderDetails}
        columns={columns}
        rowKey="productId"
        style={{ marginTop: '20px' }}
      />

      <Button
        style={{ marginTop: '20px' }}
        // onClick={() => }
      >
        Back
      </Button>
    </div>
  );
};

export default OrderShopDetail;
