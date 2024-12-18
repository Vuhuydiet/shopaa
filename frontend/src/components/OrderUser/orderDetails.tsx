import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, Table, Tag, Dropdown, message, Modal } from 'antd';
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

const OrderUserDetail: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const [order, setOrder] = useState<IOrderDetail | null>(null);
  const [hasChangeStatus, setHasChangeStatus] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    console.log('ORDER ID: ', orderId);
    const fetchData = async () => {
      const res = await getOrderDetail(Number(orderId));
      console.log('ORDER DETAIL UI : ', res);
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

  const confirmStatusChange = (orderId: number, newStatus: OrderStatus) => {
    let message: string;
    switch (newStatus) {
      case OrderStatus.CANCELED:
        message = 'Are you sure you want to cancel this order?';
        break;
      case OrderStatus.RECEIVED:
        message = 'Confirmation of successful receipt of goods.';
        break;
      case OrderStatus.COMPLETED:
        message = 'Confirmation of completion of order.';
        break;
      case OrderStatus.RETURNED:
        message = 'Are you sure you want to return this order?';
        break;
      default:
        message = '';
    }

    Modal.confirm({
      title: message,
      onOk: () => {
        console.log(`Changing order ${orderId} to ${newStatus}`);
        handleStatusChange(orderId, newStatus);
      },
    });
  };

  const getMenuItems = (status: OrderStatus, orderId: number) => {
    switch (status) {
      case OrderStatus.PENDING:
        return [
          {
            key: 'CONFIRM',
            label: 'Confirm',
            onClick: () => confirmStatusChange(orderId, OrderStatus.ACCEPTED),
          },
          {
            key: 'REJECTED',
            label: 'Reject',
            onClick: () => confirmStatusChange(orderId, OrderStatus.REJECTED),
          },
        ];
      case OrderStatus.DELIVERED:
        return [
          {
            key: 'RECEIVED',
            label: 'Mark as Received',
            onClick: () => confirmStatusChange(orderId, OrderStatus.RECEIVED),
          },
        ];
      case OrderStatus.RECEIVED:
        return [
          {
            key: 'COMPLETED',
            label: 'Mark as Completed',
            onClick: () => confirmStatusChange(orderId, OrderStatus.COMPLETED),
          },
          {
            key: 'RETURNED',
            label: 'Return Order',
            onClick: () => confirmStatusChange(orderId, OrderStatus.RETURNED),
          },
        ];
      default:
        return [];
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
    return <div>Loading...</div>;
  }

  const menuItems = getMenuItems(order?.status, order.orderId);

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
                Name buyer:
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
                Shipping fee:
              </td>
              <td style={{ padding: '8px' }}>$ {order.shippingFee}</td>
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
                {menuItems.length > 0 ? (
                  <Dropdown
                    menu={{
                      items: menuItems,
                    }}
                  >
                    <span
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
        onClick={() => navigate('/user/orders')}
      >
        Back
      </Button>
    </div>
  );
};

export default OrderUserDetail;
