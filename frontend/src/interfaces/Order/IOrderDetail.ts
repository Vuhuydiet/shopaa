import { OrderStatus } from './OrderEnums';

export interface IOrderDetail {
  orderId: number;
  customerId: number;
  customerNumber: string;
  shippingAddress: string;
  shippingFee: number;
  shopId: number;
  status: OrderStatus;
  totalAmount: number;
  transProviderId: number;
  createdAt: string;
  updatedAt: string;
}
