import { OrderStatus } from './Order/OrderEnums';

export interface IRevenueData {
  month: string;
  totalRevenue: number;
  year: string;
}

export interface IProductStatsData {
  month: string;
  productName: string;
  totalRevenue: number;
  year: string;
}

export interface IOrderStatsData {
  month: string;
  orderStatus: OrderStatus;
  totalOrder: string;
  year: string;
}
