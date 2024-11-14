export interface IFilterProduct {
  keyword?: string;
  shopId?: number;
  category?: number;
  brand?: string;
  postedAfter?: Date;
  postedBefore?: Date;
  minPrice?: number;
  maxPrice?: number;
  minQuantity?: number;
  maxQuantity?: number;
  sortBy?: string;
  order?: string;
  offset?: number;
  limit?: number;
}
