import { ReturnStatus } from './OrderEnums';

export interface IReturnSlip {
  returnId: number;
  orderId: number;
  createdAt: Date;
  status?: ReturnStatus;
  reason?: string;
}
