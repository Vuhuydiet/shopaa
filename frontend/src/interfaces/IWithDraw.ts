export enum WithdrawStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  REJECTED = 'REJECTED',
}

export interface WithdrawQuery {
  requestId: number;
  postAfter?: Date;
  postBefore?: Date;
  sortBy?: 'createdAt';
  order?: 'asc' | 'desc';
  shopId?: number;
  offset?: number;
  limit?: number;
}

export interface IWithdraw {
  requestId: number;
  handlerId?: number;
  shopId: number;
  amount: number;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  note?: string;
  shopName?: string;
}
