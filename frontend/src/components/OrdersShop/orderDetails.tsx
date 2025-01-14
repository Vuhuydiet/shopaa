import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Table, Tag, Dropdown, message, Spin } from 'antd';
import { EditOutlined } from '@ant-design/icons';
import { getOrderDetail, updateStatusOrder } from '../../service/orderService';
import { IOrderDetail } from '../../interfaces/Order/IOrderDetail';
import { OrderStatus } from '../../interfaces/Order/OrderEnums';
import { getOrderStatusColor } from '../../utils/getColorStatusOrder';
import { deserializeDate } from '../../utils/date-convert';
import { IProductOrder } from '../../interfaces/Order/IProductOrder';

interface OrderDetail {
  productId: number;
  productName: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
}

const OrderShopDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<IOrderDetail | null>(null);
  const [hasChangeStatus, setHasChangeStatus] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      const res = await getOrderDetail(Number(orderId));
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
      console.log('RES: ', res);
      if (res) {
        message.success('Change status successfully');
        setHasChangeStatus(!hasChangeStatus);
      }
    } catch (error: any) {
      message.error(error.message);
    }
  };

  const columns = [
    {
      title: '#',
      render: (_: any, __: IProductOrder, index: number) => index + 1,
      key: 'index',
    },
    {
      title: 'Product image',
      dataIndex: 'productImageUrl',
      key: 'productImageUrl',
      render: (url: string) => (
        <img src={url} alt="product" style={{ width: '50px' }} />
      ),
    },
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
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '50vh',
        }}
      >
        <Spin tip="Loading Order Details..." />
      </div>
    );
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
              <td style={{ padding: '8px' }}>{order.customerName}</td>
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
                $ {order.totalAmount.toFixed(2)}
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
                    {order.status === OrderStatus.RETURN_REQUESTED
                      ? 'WAITING RETURN'
                      : order.status}
                  </Tag>
                )}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <Table
        dataSource={order.orderProducts}
        columns={columns}
        rowKey="productId"
        style={{ marginTop: '20px' }}
        onRow={(record) => ({
          onClick: () => navigate(`/product-detail/${record.productId}`),
        })}
      />

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
