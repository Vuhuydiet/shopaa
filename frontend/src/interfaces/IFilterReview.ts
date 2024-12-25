export interface IFilterReview {
  orderId?: number;
  userId?: number;
  shopId?: number;
  productId?: number;
  rating?: number;
  offset?: number;
  limit?: number;
  sortBy?: 'createdAt';
  order?: 'asc' | 'desc';
}
