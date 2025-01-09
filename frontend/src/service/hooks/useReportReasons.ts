import { useQuery } from 'react-query';
import { getReportReasons } from '../api/report';

export const useReportReasons = (type: string) => {
  const { data: reasons } = useQuery({
    queryKey: ['reportReasons'],
    queryFn: () => getReportReasons(type),
  });

  return reasons;
};
