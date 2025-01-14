export interface IQueryOrder {
  userId?: number;
  shopId?: number;
  providerId?: number;
  product?: number;
  status?: string[];
  createdAfter?: string;
  createdBefore?: string;
  minValue?: number;
  maxValue?: number;
  sortBy?: string;
  order?: string;
  offset?: number;
  limit?: number;
}
