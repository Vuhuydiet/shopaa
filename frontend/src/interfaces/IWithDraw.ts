export interface WithdrawQuery {
  requestId?: number;
  postAfter?: string;
  postBefore?: string;
  sortBy?: 'createdAt';
  order?: 'asc' | 'desc';
  shopId?: number;
  offset?: number;
  limit?: number;
  status?: string;
}

export interface IWithdraw {
  requestId: number;
  handlerId?: number;
  shopId: number;
  amount: number;
  status?: string;
  createdAt: string;
  updatedAt?: string;
  note?: string;
  shopName?: string;
}
