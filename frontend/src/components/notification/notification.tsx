import {
  Popover,
  Badge,
  List,
  Space,
  Typography,
  Tag,
  Avatar,
  Button,
} from 'antd';
import {
  BellOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  CarOutlined,
  RollbackOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons';
import { OrderStatus } from '../../interfaces/Order/OrderEnums';
import { useNotification } from '../../service/hooks/useNotification';
import {
  INotification,
  INotificationStatus,
} from '../../interfaces/INotification';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { useUser } from '../../context/UserContext';
dayjs.extend(relativeTime);

const { Text, Title } = Typography;

const NotificationPopover = () => {
  const { notifications, markAsRead } = useNotification();
  const navigate = useNavigate();
  const { user } = useUser();

  const getStatusConfig = (status: OrderStatus) => {
    const configs = {
      [OrderStatus.PENDING]: {
        color: 'blue',
        icon: <ClockCircleOutlined />,
        bg: '#e6f7ff',
        description:
          user?.role === 'USER'
            ? 'Your order has been placed successfully'
            : 'A new order is waiting for your approval',
      },
      [OrderStatus.CANCELED]: {
        color: 'red',
        icon: <CloseCircleOutlined />,
        bg: '#fff1f0',
        description:
          user?.role === 'USER'
            ? 'Your order has been canceled'
            : 'Order has been canceled by customer',
      },
      [OrderStatus.ACCEPTED]: {
        color: 'cyan',
        icon: <CheckCircleOutlined />,
        bg: '#e6fffb',
        description:
          user?.role === 'USER'
            ? 'Order has been accepted by seller'
            : 'You have accepted the order',
      },
      [OrderStatus.REJECTED]: {
        color: 'red',
        icon: <CloseCircleOutlined />,
        bg: '#fff1f0',
        description: user?.role
          ? 'Order has been rejected by seller'
          : 'You have rejected the order',
      },
      [OrderStatus.DELIVERING]: {
        color: 'blue',
        icon: <CarOutlined />,
        bg: '#e6f7ff',
        description:
          user?.role === 'USER'
            ? 'Your order is on the way'
            : 'Order is on the way to the customer',
      },
      [OrderStatus.DELIVERED]: {
        color: 'geekblue',
        icon: <CheckCircleOutlined />,
        bg: '#f0f5ff',
        description:
          user?.role === 'USER'
            ? 'Your order has been delivered'
            : 'Order has has been delivered to the customer',
      },
      [OrderStatus.RECEIVED]: {
        color: 'green',
        icon: <CheckCircleOutlined />,
        bg: '#f6ffed',
        description:
          user?.role === 'USER'
            ? 'You have received the order'
            : 'Order has been received by the customer',
      },
      [OrderStatus.COMPLETED]: {
        color: 'green',
        icon: <CheckCircleOutlined />,
        bg: '#f6ffed',
        description:
          user?.role === 'USER'
            ? 'You have completed the order'
            : 'Order has been completed by the customer',
      },
      [OrderStatus.RETURNED]: {
        color: 'orange',
        icon: <RollbackOutlined />,
        bg: '#fff7e6',
        description:
          user?.role === 'USER'
            ? 'You have returned the order'
            : 'Order has been returned by the customer',
      },
      [OrderStatus.RETURN_REQUESTED]: {
        color: 'gold',
        icon: <ExclamationCircleOutlined />,
        bg: '#fffbe6',
        description:
          user?.role === 'USER'
            ? 'You have requested to return the order'
            : 'Order has been requested to return by the customer',
      },
    };
    return (
      configs[status] || {
        color: 'default',
        icon: <SyncOutlined />,
        bg: '#f5f5f5',
        description: 'Order status unknown',
      }
    );
  };

  const formatDate = (dateString: any) => {
    return dayjs(dateString).toNow(true);
  };

  const handleNotificationClick = (notification: INotification) => {
    markAsRead(notification.notificationId);

    console.log(user?.role);

    switch (notification.eventType) {
      case 'order':
        if (user?.role === 'SHOP_MANAGER') {
          navigate(`/manager-shop/list-order/${notification.payload.orderId}`);
        } else if (user?.role === 'USER') {
          navigate(`/user/orders/${notification.payload.orderId}`);
        }
        break;
      case 'review':
        navigate(
          `/product-detail/${notification.payload.productId}#review-list`,
        );
        break;
      default:
        console.log('Unknown notification type', notification.eventType);
    }
  };

  const markAllAsRead = () => {
    notifications.forEach((notif) => markAsRead(notif.notificationId));
  };

  const unreadCount = notifications.filter(
    (n) => n.status !== INotificationStatus.READ,
  ).length;

  const content = (
    <div className="notification-container">
      <div className="notification-header">
        <Space style={{ width: '100%', justifyContent: 'space-between' }}>
          <Title level={5} style={{ margin: 0 }}>
            Notifications
          </Title>
          {unreadCount > 0 && (
            <Button type="link" size="small" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </Space>
      </div>
      <List
        className="notification-list"
        dataSource={notifications}
        renderItem={(item) => {
          const statusConfig = getStatusConfig(
            item.payload.newOrderStatus || OrderStatus.COMPLETED,
          );
          return (
            <List.Item
              className={`notification-item ${item.status !== 'READ' ? 'unread' : ''}`}
              onClick={() => handleNotificationClick(item)}
            >
              <Space align="start" style={{ width: '100%' }}>
                <Avatar
                  icon={statusConfig.icon}
                  style={{
                    backgroundColor: statusConfig.color,
                    marginTop: 4,
                  }}
                />
                <Space direction="vertical" size="small" style={{ flex: 1 }}>
                  <Space>
                    <Text strong style={{ textTransform: 'capitalize' }}>
                      {item.eventType}
                    </Text>
                    {item.eventType === 'order' ? (
                      <Tag color={statusConfig.color}>
                        {item.payload?.newOrderStatus?.replace(/_/g, ' ')}
                      </Tag>
                    ) : (
                      <Tag color={statusConfig.color}>COMPLETE</Tag>
                    )}
                    {item.status !== 'READ' && (
                      <Badge
                        status="processing"
                        style={{ marginLeft: 'auto' }}
                      />
                    )}
                  </Space>
                  {item.eventType === 'order' ? (
                    <>
                      <Text>Order #{item.payload.orderId}</Text>
                      <Text>{statusConfig.description}</Text>
                    </>
                  ) : (
                    <>
                      <Text>Review product #{item.payload.productId}</Text>
                      <Text>{item.userId} has reviewed your product</Text>
                    </>
                  )}
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {formatDate(item.createdAt)}
                  </Text>
                </Space>
              </Space>
            </List.Item>
          );
        }}
      />
    </div>
  );

  return (
    <div>
      <style>{`
        .notification-container {
          max-width: 400px;
        }
        .notification-header {
          padding: 12px 16px;
          border-bottom: 1px solid #f0f0f0;
          background: #fafafa;
        }
        .notification-list {
          max-height: 400px;
          overflow: auto;
          padding: 8px 0;
        }
        .notification-item {
          padding: 12px 16px;
          cursor: pointer;
          transition: all 0.3s ease;
          margin: 0 8px;
          border-radius: 8px;
        }
        .notification-item:hover {
          background-color: #fafafa;
          transform: translateX(4px);
        }
        .notification-item.unread {
          background-color: #e6f7ff;
        }
        .notification-item.unread:hover {
          background-color: #bae7ff;
        }
        .ant-list-item {
          border-bottom: none !important;
        }
      `}</style>
      <Popover
        content={content}
        trigger="click"
        placement="bottomRight"
        overlayStyle={{ maxHeight: '80vh', padding: 0 }}
      >
        <Badge count={unreadCount} offset={[-2, 2]}>
          <BellOutlined
            style={{
              fontSize: '24px',
              cursor: 'pointer',
              padding: '8px',
              borderRadius: '50%',
              backgroundColor: '#f0f0f0',
              transition: 'all 0.3s ease',
            }}
          />
        </Badge>
      </Popover>
    </div>
  );
};

export default NotificationPopover;
