import { OrderStatus } from './OrderEnums';
import { IOrderDetail } from './IOrderDetail';
import { IReturnSlip } from './IReturnSlip';

export interface IOrder {
  orderId: number;
  customerId?: number;
  shopId?: number;
  shippingAddress: string;
  transProviderId?: number;
  status: OrderStatus;
  createdAt: Date;
  updatedAt: Date;
  shippingFee: number;
  totalAmount: number;
  orderProducts: IOrderDetail[];
  returnSlip: IReturnSlip[];
}
