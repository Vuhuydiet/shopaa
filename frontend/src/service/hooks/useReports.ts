import { useQuery } from 'react-query';
import { IReport } from '../../interfaces/IReport';
import axios from 'axios';
import { IReportParams } from '../../interfaces/IReportParams';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';
import { REPORT_API_ENDPOINTS } from '../../config/API_config';

export interface IPostReportResult {
  reportId: number;
  result: 'accepted' | 'dismissed';
  reason: string;
}

export const useReports = (params: IReportParams) => {
  const navigate = useNavigate();

  async function getReports(params: IReportParams): Promise<IReport[]> {
    const token = localStorage.getItem('token');

    if (!token) {
      message.error('Please login first');
      navigate('/login');
      return [];
    }

    try {
      const response = await axios.get(REPORT_API_ENDPOINTS.REPORTS, {
        params: params,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response?.data?.metadata) {
        throw new Error('No data found');
      }

      const data = response.data.metadata.reports.map(
        (report: any, index: any): IReport => {
          const result = {
            key: index,
            id: report?.reportId,
            reporterId: report?.reporterId,
            createdAt: report?.createdAt,
            description: report?.description,
            type: report?.type,
            shopCategory: report?.shopCategory,
            productCategory: report?.productCategory,
            shopId: report?.shopId,
            productId: report?.productId,
            reportResult: report?.reportResult
              ? {
                  reportId: report?.reportResult?.reportId,
                  createdAt: report?.reportResult?.createdAt,
                  handlerId: report?.reportResult?.handlerId,
                  result: report?.reportResult?.result,
                  reason: report?.reportResult?.reason,
                }
              : null,
          };

          return result;
        },
      );

      return data;
    } catch (error) {
      console.log(error);
    }

    return [];
  }

  return {
    report: useQuery({
      queryKey: ['reports', params],
      queryFn: () => getReports(params),
    }),

    postReportResult: postReportResult,
  };
};

async function postReportResult(report: IPostReportResult) {
  const token = localStorage.getItem('token');

  if (!token) {
    throw new Error('Please login first');
    return;
  }

  try {
    await axios.post(
      `${REPORT_API_ENDPOINTS.REPORTS}/${report.reportId}/result`,
      {
        result: report.result,
        reason: report.reason,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      },
    );
  } catch (error) {
    throw new Error('Failed to post report result');
  }
}
