import { IProductOrder } from './IProductOrder';
import { OrderStatus } from './OrderEnums';

export interface IOrderDetail {
  orderId: number;
  customerId: number;
  customerName: string;
  customerNumber: string;
  shippingAddress: string;
  shippingFee: number;
  shopId: number;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  orderProducts: IProductOrder[];
  transportationProvider: {
    providerId: number;
    providerName: string;
  };
}
