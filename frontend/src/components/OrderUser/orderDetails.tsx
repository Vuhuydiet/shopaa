import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Button,
  Table,
  Tag,
  Dropdown,
  message,
  Modal,
  Spin,
  Form as FormAntd,
} from 'antd';
import {
  EditOutlined,
  RightCircleOutlined,
  ShopOutlined,
} from '@ant-design/icons';
import { getOrderDetail, updateStatusOrder } from '../../service/orderService';
import { IOrderDetail } from '../../interfaces/Order/IOrderDetail';
import { OrderStatus } from '../../interfaces/Order/OrderEnums';
import { getOrderStatusColor } from '../../utils/getColorStatusOrder';
import { deserializeDate } from '../../utils/date-convert';
import { IProductOrder } from '../../interfaces/Order/IProductOrder';
import { NavLink } from 'react-router-dom';
import { useOrders } from '../../service/hooks/order/useOrders';
import { FormReview } from '../form-review';
import { FormReturn } from '../form-return';
import axios from 'axios';
import { RETURN_API_ENDPOINTS } from '../../config/API_config';
import { QueryClient, QueryClientProvider } from 'react-query';

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
  const [orderProduct, setOrderProduct] = useState<IProductOrder | null>(null);
  const navigate = useNavigate();
  const { refetch } = useOrders({ status: [] });
  const [form] = FormAntd.useForm();

  const handleSubmitReturn = (values: any) => {
    const request = {
      orderId: orderId,
      ...values,
    };

    console.log('return', request);

    try {
      axios.post(RETURN_API_ENDPOINTS.RETURN, request, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
    } catch (error: any) {
      message.error(error?.message);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const res = await getOrderDetail(Number(orderId));
      if (res) setOrder(res);
    };
    fetchData();
  }, [orderId, hasChangeStatus, orderProduct]);

  const handleStatusChange = async (
    orderId: number,
    newStatus: OrderStatus,
  ) => {
    try {
      const res = await updateStatusOrder(orderId, newStatus);
      if (res) {
        message.success('Change status successfully');
        refetch();
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
      case OrderStatus.RETURN_REQUESTED:
        message = 'Are you sure you want to return this order?';
        break;
      default:
        message = '';
    }

    Modal.confirm({
      title: message,
      content:
        newStatus === OrderStatus.RETURN_REQUESTED ? (
          <QueryClientProvider client={new QueryClient()}>
            <FormReturn form={form} handleSubmitReturn={handleSubmitReturn} />
          </QueryClientProvider>
        ) : (
          ''
        ),
      onOk: () => {
        console.log(`Changing order ${orderId} to ${newStatus}`);
        form.submit();
        handleStatusChange(orderId, newStatus);
      },
    });
  };

  const getMenuItems = (status: OrderStatus, orderId: number) => {
    switch (status) {
      case OrderStatus.PENDING:
        return [
          {
            key: 'CANCELED',
            label: 'Cancel Order',
            onClick: () => confirmStatusChange(orderId, OrderStatus.CANCELED),
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
            key: 'RETURN_REQUESTED',
            label: 'Return Order',
            onClick: () =>
              confirmStatusChange(orderId, OrderStatus.RETURN_REQUESTED),
          },
        ];
      default:
        return [];
    }
  };

  const handleReview = (e: any, record: IProductOrder) => {
    e.stopPropagation();

    console.log('detail', record);
    setOrderProduct(record);
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
      render: (url: string | null) => (
        <img src={url ?? ''} alt="product" style={{ width: '50px' }} />
      ),
    },
    {
      title: 'Product name',
      dataIndex: 'productName',
      key: 'productName',
    },
    {
      title: 'Type',
      key: 'type',
      render: (_: any, record: IProductOrder) => (
        <div>
          {record.color && <>Color: {record.color}</>}
          {record.size && <>Size: {record.size}</>}
        </div>
      ),
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
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: IProductOrder) => {
        if (record.status === 'COMPLETED' && !record.isReviewed) {
          return (
            <button
              onClick={(e) => handleReview(e, record)}
              style={{
                background: '#4CAF50',
                color: '#fff',
                border: 'none',
                padding: '5px 10px',
                cursor: 'pointer',
              }}
            >
              Review
            </button>
          );
        }
        return (
          <Button type="default">
            <NavLink to={`/product-detail/${record.productId}`}>View</NavLink>
          </Button>
        );
      },
    },
  ];

  if (!order) {
    return (
      <Spin
        spinning={!order}
        style={{
          width: '100%',
          height: '400px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
        tip="Loading order detail ..."
      />
    );
  }

  const menuItems = getMenuItems(order?.status, order.orderId);

  return orderProduct ? (
    <FormReview order={orderProduct} setOrderProduct={setOrderProduct} />
  ) : (
    <Spin spinning={!order} tip="Loading...">
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
                <td style={{ padding: '8px', fontWeight: 'bold' }}>
                  $ {(order.totalAmount + order.shippingFee).toFixed(2)}
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

        <div style={{ marginTop: '40px' }}>
          <ShopOutlined
            style={{ fontSize: '20px', marginRight: '10px', color: 'orange' }}
          />
          <NavLink to={`/shop/${order.shopId}`} style={{ fontSize: '1.1rem' }}>
            {order.shopName}
            <RightCircleOutlined
              style={{ marginLeft: '5px', color: 'purple' }}
            />
          </NavLink>
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
    </Spin>
  );
};

export default OrderUserDetail;
