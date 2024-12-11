import { OrderStatus } from './OrderEnums';

export interface IOrder {
  orderId: number;
  customerId: number;
  customerNumber: string;
  shopId?: number;
  shippingAddress: string;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  shippingFee: number;
  totalAmount: number;
}
