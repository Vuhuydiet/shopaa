import axios from 'axios';
import { useQuery } from 'react-query';
import { RETURN_API_ENDPOINTS } from '../../config/API_config';
import { IReason } from '../../interfaces/IReason';

export const useReasons = () => {
  return useQuery({
    queryKey: 'reasons',
    queryFn: () => getReasons(),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

const getReasons = async (): Promise<IReason[]> => {
  const res = await axios.get(RETURN_API_ENDPOINTS.REASONS);

  return res.data?.metadata?.reasons ?? [];
};
