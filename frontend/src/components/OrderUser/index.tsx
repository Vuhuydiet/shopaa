import { useEffect, useState } from 'react';
import { Menu, Table, Tag, Button, Space, Dropdown, Spin, Modal } from 'antd';
import { NavLink } from 'react-router-dom';
import { EditOutlined } from '@ant-design/icons';
import {
  useOrders,
  useUpdateOrderStatus,
} from '../../service/api/order/useOrders';
import { OrderStatus } from '../../interfaces/Order/OrderEnums';
import { IOrder } from '../../interfaces/Order/IOrder';
import { getOrderStatusColor } from '../../utils/getColorStatusOrder';

const OrderUser: React.FC = () => {
  const [currentStatus, setCurrentStatus] = useState<string[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(7);
  const [total, setTotal] = useState<number>(0);
  const { data, isLoading } = useOrders({
    userId: parseInt(localStorage.getItem('userId') || '0'),
    sortBy: 'updatedAt',
    order: 'desc',
    limit: pageSize,
    offset: (currentPage - 1) * pageSize,
    status: currentStatus,
  });
  console.log('Order: ', data);
  const { mutate: updateStatus } = useUpdateOrderStatus();
  const changeFilteredOrders = () => {
    if (filteredOrders === 'all') {
      setCurrentStatus([]);
    } else if (filteredOrders === 'pending') {
      setCurrentStatus(['PENDING']);
    } else if (filteredOrders === 'processing') {
      setCurrentStatus(['ACCEPTED', 'DELIVERING', 'RECEIVED']);
    } else if (filteredOrders === 'delivered') {
      setCurrentStatus(['DELIVERED']);
    } else if (filteredOrders === 'completed') {
      setCurrentStatus(['COMPLETED']);
    } else if (filteredOrders === 'canceled') {
      setCurrentStatus(['CANCELED']);
    } else if (filteredOrders === 'returned') {
      setCurrentStatus(['RETURNED', 'REJECTED']);
    }
    console.log('Current Status: ', currentStatus);
  };

  useEffect(() => {
    if (
      sessionStorage.getItem('FilterOrder') &&
      sessionStorage.getItem('CurrentPage')
    ) {
      setCurrentPage(parseInt(sessionStorage.getItem('CurrentPage') || '1'));
      setFilteredOrders(sessionStorage.getItem('FilterOrder') || 'all');
      sessionStorage.clear();
    }
    changeFilteredOrders();
    setTotal(data?.count);
  }, [filteredOrders, data]);

  const menuItems = [
    { key: 'all', label: 'All' },
    { key: 'pending', label: 'Pending' },
    { key: 'processing', label: 'Processing' },
    { key: 'delivered', label: 'Delivered' },
    { key: 'completed', label: 'Completed' },
    { key: 'canceled', label: 'Canceled' },
    { key: 'returned', label: 'Returned/Rejected' },
  ];

  const handleStatusChange = (orderId: number, newStatus: OrderStatus) => {
    updateStatus({ orderId, status: newStatus });
  };

  const columns = [
    {
      title: '#',
      render: (_: any, __: IOrder, index: number) => index + 1,
      key: 'index',
    },
    {
      title: 'Order ID',
      dataIndex: 'orderId',
      key: 'orderId',
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
      render: (text: string) => {
        const date = new Date(text);
        return date.toLocaleString();
      },
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: OrderStatus, record: IOrder) => {
        const confirmStatusChange = (newStatus: OrderStatus) => {
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
            title: `${message}`,
            onOk: () => {
              console.log(`Changing order ${record.orderId} to ${newStatus}`);
              handleStatusChange(record.orderId, newStatus);
            },
          });
        };
        const getMenuItems = () => {
          switch (status) {
            case OrderStatus.PENDING:
              return [
                {
                  key: 'CANCELED',
                  label: 'Cancel',
                  onClick: () => confirmStatusChange(OrderStatus.CANCELED),
                },
              ];
            case OrderStatus.DELIVERED:
              return [
                {
                  key: 'RECEIVED',
                  label: 'Mark as Received',
                  onClick: () => confirmStatusChange(OrderStatus.RECEIVED),
                },
              ];
            case OrderStatus.RECEIVED:
              return [
                {
                  key: 'COMPLETED',
                  label: 'Mark as Completed',
                  onClick: () => confirmStatusChange(OrderStatus.COMPLETED),
                },
                {
                  key: 'RETURNED',
                  label: 'Return Order',
                  onClick: () => confirmStatusChange(OrderStatus.RETURNED),
                },
              ];
            default:
              return [];
          }
        };

        const menuItems = getMenuItems();

        return menuItems.length > 0 ? (
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
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'start',
                whiteSpace: 'nowrap',
              }}
            >
              <Tag color={getOrderStatusColor(status)}>{status}</Tag>
              <EditOutlined style={{ marginLeft: '3px' }} />
            </span>
          </Dropdown>
        ) : (
          <Tag color={getOrderStatusColor(status)}>{status}</Tag>
        );
      },
    },
    {
      title: 'Action',
      key: 'action',
      render: (record: IOrder) => (
        <Space size="middle">
          <Button
            type="default"
            onClick={() => {
              sessionStorage.setItem('FilterOrder', filteredOrders);
              sessionStorage.setItem('CurrentPage', currentPage.toString());
            }}
          >
            <NavLink to={`/user/orders/${record.orderId}`}>Detail</NavLink>
          </Button>
          {record.status === OrderStatus.COMPLETED ? (
            <Button type="link">
              <NavLink to={`/user/orders/${record.orderId}`}>Review</NavLink>
            </Button>
          ) : null}
        </Space>
      ),
    },
  ];

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
            selectedKeys={[filteredOrders]}
            onClick={(e) => {
              setCurrentPage(1);
              setFilteredOrders(e.key);
            }}
            items={menuItems}
          />
          <Spin spinning={isLoading} tip="Loading orders...">
            <Table
              dataSource={data?.items}
              columns={columns}
              rowKey="orderId"
              style={{ marginTop: '16px' }}
              pagination={{
                current: currentPage,
                pageSize: pageSize,
                showLessItems: true,
                total: total,
                onChange: async (page, size) => {
                  setCurrentPage(page);
                  setPageSize(size);
                },
              }}
            />
          </Spin>
        </div>
      </div>
    </>
  );
};

export default OrderUser;