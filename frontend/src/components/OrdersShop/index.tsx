import { useEffect, useState } from 'react';
import { Menu, Table, Tag, Button, Space, Dropdown, Spin } from 'antd';
import { NavLink } from 'react-router-dom';
import { EditOutlined } from '@ant-design/icons';
import {
  useOrders,
  useUpdateOrderStatus,
} from '../../service/api/order/useOrders';
import { OrderStatus } from '../../interfaces/Order/OrderEnums';
import { IOrder } from '../../interfaces/Order/IOrder';
import { getOrderStatusColor } from '../../utils/getColorStatusOrder';

const OrderShop: React.FC = () => {
  const [currentStatus, setCurrentStatus] = useState<string[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState<number>(5);
  const [total, setTotal] = useState<number>(0);
  const { data, isLoading } = useOrders({
    shopId: parseInt(localStorage.getItem('userId') || '0'),
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
      setCurrentStatus(['ACCEPTED', 'DELIVERING', 'RECEIVED', 'DELIVERED']);
    } else if (filteredOrders === 'completed') {
      setCurrentStatus(['COMPLETED']);
    } else if (filteredOrders === 'rejected') {
      setCurrentStatus(['REJECTED']);
    } else if (filteredOrders === 'returned') {
      setCurrentStatus(['RETURNED']);
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
    { key: 'completed', label: 'Completed' },
    { key: 'rejected', label: 'Rejected' },
    { key: 'returned', label: 'Returned' },
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
      title: 'Customer phone',
      dataIndex: 'customerNumber',
      key: 'customerNumber',
    },

    {
      title: 'Total amount',
      key: 'totalAmount',
      render: (amount: IOrder) =>
        `$${(amount.shippingFee + amount.totalAmount).toFixed(2)}`,
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
      render: (status: OrderStatus, record: IOrder) =>
        status === 'PENDING' ? (
          <Dropdown
            menu={{
              items: [
                {
                  key: 'CONFIRM',
                  label: 'CONFIRM',
                  onClick: () =>
                    handleStatusChange(record.orderId, OrderStatus.ACCEPTED),
                },
                {
                  key: 'REJECTED',
                  label: 'REJECT',
                  onClick: () =>
                    handleStatusChange(record.orderId, OrderStatus.REJECTED),
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
        ),
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
            <NavLink to={`/manager-shop/list-order/${record.orderId}`}>
              Detail
            </NavLink>
          </Button>
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

export default OrderShop;
