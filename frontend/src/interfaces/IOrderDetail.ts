export interface IOrderDetail {
  orderId: number;
  productId: number;
  color?: string;
  size?: string;
  quantity: number;
  price: number;
}
