import { OrderStatus } from './Order/OrderEnums';

export enum INotificationStatus {
  NOT_SENT = 'NOT_SENT',
  SENT = 'SENT',
  READ = 'READ',
}

export interface INotification {
  notificationId: number;
  userId: number;
  eventType: string;
  payload: {
    orderId?: number;
    newOrderStatus?: OrderStatus;

    reviewId?: number;
    productId?: number;

    updatedAt: string;
  };
  createdAt: string;
  status: INotificationStatus;
}
