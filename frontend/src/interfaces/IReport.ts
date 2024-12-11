import { IReportResult } from './IReportResult';

export interface IReport {
  id: number;
  reporterId: number;
  createdAt: string;
  description: string | null;
  type: string | null;
  shopCategory: string | null;
  productCategory: string | null;
  shopId: number | null;
  productId: number | null;
  reportResult: IReportResult | null;
}
