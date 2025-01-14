import { OrderStatus } from './Order/OrderEnums';

export interface IOrderStatistics {
  shopOwnerId: number;
  shopName: string;
  orderStatus: OrderStatus;
  year: number;
  month: number;
  totalOrders: number;
}
