export enum ReturnStatus {
  PENDING = 'PENDING',
  ACCEPTED = 'ACCEPTED',
  DISMISSED = 'DISMISSED',
}

export interface IReturnSlip {
  returnId: number;
  orderId: number;
  createdAt: string;
  status: ReturnStatus;
  reason?: string;
  description?: string;
  result?: string;
  createdAtOrder?: string;
  customerName?: string;
  totalAmount?: number;
  customerNumber?: string;
  shippingFee?: number;
  shippingAddress?: string;
}

export interface ReturnSlipQueryParams {
  orderId?: number;
  status?: string;
  postAfter?: string;
  postBefore?: string;
  reason?: string;
  sortBy?: 'createdAt';
  order?: 'asc' | 'desc';
  shopId?: number;
  customerId?: number;
  limit?: number;
  offset?: number;
}
