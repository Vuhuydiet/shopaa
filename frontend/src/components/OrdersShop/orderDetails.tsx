import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Table, Tag, Dropdown, message } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { getOrderDetail, updateStatusOrder } from '../../service/orderService';
import { IOrderDetail } from '../../interfaces/Order/IOrderDetail';
import { OrderStatus } from '../../interfaces/Order/OrderEnums';
import { getOrderStatusColor } from '../../utils/getColorStatusOrder';
import { deserializeDate } from '../../utils/date-convert';

interface OrderDetail {
  productId: number;
  productName: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
}

// const fetchedOrder: Order = {
//   // orderId: Number(orderId),
//   customerName: 'Nguyễn Văn A',
//   phoneNumber: '0123456789',
//   status: 'Pending',
//   totalAmount: 200,
//   createdAt: '2024-12-01 10:30',
//   orderDetails: [
//     {
//       productId: 1,
//       productName: 'Áo thun nam',
//       color: 'Đỏ',
//       size: 'M',
//       quantity: 2,
//       price: 50,
//     },
//     {
//       productId: 2,
//       productName: 'Quần jeans',
//       color: 'Xanh',
//       size: 'L',
//       quantity: 1,
//       price: 100,
//     },
//   ],
// };
// setOrder(fetchedOrder);

const OrderShopDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<IOrderDetail | null>(null);
  const [hasChangeStatus, setHasChangeStatus] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('ORDER ID: ', orderId);
    const fetchData = async () => {
      const res = await getOrderDetail(Number(orderId));
      console.log('ORDER DETAIL: ', res);
      if (res) setOrder(res);
    };
    fetchData();
  }, [orderId, hasChangeStatus]);

  const handleStatusChange = async (
    orderId: number,
    newStatus: OrderStatus,
  ) => {
    try {
      const res = await updateStatusOrder(orderId, newStatus);
      if (res) {
        message.success('Change status successfully');
        setHasChangeStatus(!hasChangeStatus);
      }
    } catch (error) {
      message.error('Change status failed');
    }
  };

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
    <div style={{ padding: '50px', color: 'black' }}>
      <h1>Order detail {order.orderId}</h1>
      <hr />
      <div style={{ marginTop: '40px' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <tbody>
            <tr>
              <td
                style={{ padding: '8px', fontWeight: 'bold', width: '150px' }}
              >
                Order ID:
              </td>
              <td style={{ padding: '8px' }}>{order.orderId}</td>
            </tr>
            <tr>
              <td
                style={{ padding: '8px', fontWeight: 'bold', width: '150px' }}
              >
                Customer Name:
              </td>
              <td style={{ padding: '8px' }}>{order.customerId}</td>
            </tr>
            <tr>
              <td
                style={{ padding: '8px', fontWeight: 'bold', width: '150px' }}
              >
                Phone:
              </td>
              <td style={{ padding: '8px' }}>{order.customerNumber}</td>
            </tr>
            <tr>
              <td
                style={{ padding: '8px', fontWeight: 'bold', width: '150px' }}
              >
                Address:
              </td>
              <td style={{ padding: '8px' }}>{order.shippingAddress}</td>
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
              <td style={{ padding: '8px' }}>
                {deserializeDate(order.createdAt).toLocaleString()}
              </td>
            </tr>
            <tr>
              <td
                style={{ padding: '8px', fontWeight: 'bold', width: '150px' }}
              >
                Status:
              </td>
              <td style={{ padding: '8px' }}>
                {order.status === OrderStatus.PENDING ? (
                  <Dropdown
                    menu={{
                      items: [
                        {
                          key: 'CONFIRM',
                          label: 'CONFIRM',
                          onClick: () =>
                            handleStatusChange(
                              order.orderId,
                              OrderStatus.ACCEPTED,
                            ),
                        },
                        {
                          key: 'REJECTED',
                          label: 'REJECT',
                          onClick: () =>
                            handleStatusChange(
                              order.orderId,
                              OrderStatus.REJECTED,
                            ),
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
                        cursor: 'pointer',
                        display: 'inline-block',
                      }}
                    >
                      <Tag color={getOrderStatusColor(order.status)}>
                        {order.status}
                      </Tag>
                      <EditOutlined style={{ marginLeft: '3px' }} />
                    </span>
                  </Dropdown>
                ) : (
                  <Tag color={getOrderStatusColor(order.status)}>
                    {order.status}
                  </Tag>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* <Table
        dataSource={order.products}
        columns={columns}
        rowKey="productId"
        style={{ marginTop: '20px' }}
      /> */}

      <Button
        style={{ marginTop: '20px' }}
        onClick={() => navigate('/manager-shop/list-order')}
      >
        Back
      </Button>
    </div>
  );
};

export default OrderShopDetail;
