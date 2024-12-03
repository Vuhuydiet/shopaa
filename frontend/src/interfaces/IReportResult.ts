export interface IReportResult {
  reportId: number;
  createdAt: string;
  handlerId: number;
  result: 'accepted' | 'dismissed';
}
