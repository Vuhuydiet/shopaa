export interface IReportParams {
  unprocess?: boolean;
  shopId?: number;
  productId?: number;
  postedAfter?: string;
  postedBefore?: string;
  type?: 'shop' | 'product';
  result?: 'accepted' | 'dismissed';
  category?: string;
  sortBy?: 'createdAt';
  order?: 'asc' | 'desc';
  offset?: string;
  limit?: string;
}
