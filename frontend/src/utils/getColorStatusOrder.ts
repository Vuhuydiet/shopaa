import { OrderStatus } from '../interfaces/Order/OrderEnums';

export const getOrderStatusColor = (status: OrderStatus): string => {
  const statusColors: Record<OrderStatus, string> = {
    [OrderStatus.PENDING]: 'orange',
    [OrderStatus.CANCELED]: 'red',
    [OrderStatus.ACCEPTED]: 'blue',
    [OrderStatus.REJECTED]: 'yellow',
    [OrderStatus.DELIVERING]: 'cyan',
    [OrderStatus.DELIVERED]: 'green',
    [OrderStatus.RECEIVED]: 'purple',
    [OrderStatus.COMPLETED]: 'geekblue',
    [OrderStatus.RETURNED]: 'magenta',
  };

  return statusColors[status] || 'DefaultColor';
};
