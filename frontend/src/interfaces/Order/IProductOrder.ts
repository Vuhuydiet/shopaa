import { OrderStatus } from './OrderEnums';

export interface IProductOrder {
  orderId?: number;
  orderDetailNumber?: number;
  productId: number;
  productName: string;
  color: string;
  size: string;
  quantity: number;
  price: number;
  productImageUrl: string;
  status?: OrderStatus;
  updatedAt?: string;
}
