import { useQuery } from 'react-query';
import { IReport } from '../../interfaces/IReport';
import axios from 'axios';
import { ADMIN_API_ENDPOINTS } from '../../config/API_config';
import { IReportParams } from '../../interfaces/IReportParams';
import { useNavigate } from 'react-router-dom';
import { message } from 'antd';

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
      const response = await axios.get(ADMIN_API_ENDPOINTS.REPORTS, {
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
          const temp = {
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
                }
              : null,
          };

          return temp;
        },
      );

      return data;
    } catch (error) {
      console.log(error);
    }

    return [];
  }

  return useQuery({
    queryKey: ['reports', params],
    queryFn: () => getReports(params),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
