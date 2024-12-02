// import { useState } from 'react';
// import { Menu, Table, Tag, Button, Dropdown, Select } from 'antd';

// type OrderStatus =
//   | 'pending'
//   | 'cancelled'
//   | 'confirmed'
//   | 'shipping'
//   | 'delivered'
//   | 'returned';

// interface Order {
//   id: number;
//   name: string;
//   status: OrderStatus;
// }

// const OrderShop = () => {
//   const [currentStatus, setCurrentStatus] = useState<string>('all');
//   const [orders, setOrders] = useState<Order[]>([
//     { id: 1, name: 'Đơn hàng A', status: 'pending' },
//     { id: 2, name: 'Đơn hàng B', status: 'cancelled' },
//     { id: 3, name: 'Đơn hàng C', status: 'confirmed' },
//     { id: 4, name: 'Đơn hàng D', status: 'shipping' },
//     { id: 5, name: 'Đơn hàng E', status: 'delivered' },
//     { id: 6, name: 'Đơn hàng F', status: 'delivered' },
//     { id: 7, name: 'Đơn hàng G', status: 'returned' },
//   ]);

//   const statusMapping: Record<OrderStatus, string> = {
//     pending: 'Pending',
//     confirmed: 'Confirmed',
//     shipping: 'Shipping',
//     delivered: 'Delivered',
//     cancelled: 'Cancelled',
//     returned: 'Returned',
//   };

//   const statusOptions: { value: OrderStatus; label: string }[] = [
//     { value: 'confirmed', label: 'Confirm' },
//     { value: 'cancelled', label: 'Cancel' },
//   ];

//   const menuItems = [
//     { key: 'all', label: 'All' },
//     ...Object.keys(statusMapping).map((status) => ({
//       key: status,
//       label: statusMapping[status as OrderStatus],
//     })),
//   ];

//   const filteredOrders =
//     currentStatus === 'all'
//       ? orders
//       : orders.filter((order) => order.status === currentStatus);

//   const columns = [
//     {
//       title: '#',
//       render: (_: any, __: Order, index: number) => index + 1,
//       key: 'index',
//     },
//     {
//       title: 'Order ID',
//       dataIndex: 'name',
//       key: 'name',
//     },
//     {
//       title: 'Status',
//       dataIndex: 'status',
//       key: 'status',
//       render: (status: OrderStatus, record: Order) => (
//         <>
//           <Tag color={getStatusColor(status)}>{statusMapping[status]}</Tag>
//           {status === 'pending' && (
//             <Dropdown
//               overlay={
//                 <Select
//                   value={status}
//                   onChange={(value) => handleStatusChange(record.id, value)}
//                   options={statusOptions}
//                   style={{ width: 150 }}
//                 />
//               }
//             >
//               <Button size="small">Edit</Button>
//             </Dropdown>
//           )}
//         </>
//       ),
//     },
//   ];

//   const handleStatusChange = (orderId: number, newStatus: OrderStatus) => {
//     setOrders((prevOrders) =>
//       prevOrders.map((order) =>
//         order.id === orderId ? { ...order, status: newStatus } : order,
//       ),
//     );
//   };

//   const getStatusColor = (status: OrderStatus) => {
//     switch (status) {
//       case 'pending':
//         return 'orange';
//       case 'cancelled':
//         return 'red';
//       case 'confirmed':
//         return 'blue';
//       case 'shipping':
//         return 'cyan';
//       case 'delivered':
//         return 'green';
//       case 'returned':
//         return 'magenta';
//       default:
//         return 'gray';
//     }
//   };

//   return (
//     <>
//       <div style={{ padding: '30px', color: 'black' }}>
//         <h1
//           style={{
//             textAlign: 'left',
//             marginLeft: '10px',
//             marginBottom: '10px',
//           }}
//         >
//           List order
//         </h1>
//         <hr />

//         <div
//           style={{
//             marginTop: '40px',
//           }}
//         >
//           <Menu
//             mode="horizontal"
//             selectedKeys={[currentStatus]}
//             onClick={(e) => setCurrentStatus(e.key)}
//             items={menuItems}
//           />
//           <Table
//             dataSource={filteredOrders}
//             columns={columns}
//             rowKey="id"
//             style={{ marginTop: '16px' }}
//           />
//         </div>
//       </div>
//     </>
//   );
// };

// export default OrderShop;

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Table, Tag, Button, Space } from 'antd';
import { NavLink } from 'react-router-dom';

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
  status: string;
  totalAmount: number;
  createdAt: string;
}

const OrderShop: React.FC = () => {
  const [currentStatus, setCurrentStatus] = useState<string>('all');
  const [orders] = useState<Order[]>([
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
      render: (status: OrderStatus) => (
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
      render: (text: any, record: Order) => (
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
