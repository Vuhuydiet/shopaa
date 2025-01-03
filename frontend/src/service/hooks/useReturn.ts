import { useMutation, useQuery, useQueryClient } from 'react-query';
import { AxiosResponse } from 'axios';
import {
  ReturnSlipQueryParams,
  ReturnStatus,
} from '../../interfaces/Order/IReturnSlip';
import { getReturnSlips, updateReturnSlip } from '../returnService';
import { message } from 'antd';

const cleanParams = (params: ReturnSlipQueryParams): ReturnSlipQueryParams => {
  const cleanedParams = Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) => value !== null && value !== undefined && value !== '',
    ),
  );
  return cleanedParams as ReturnSlipQueryParams;
};

export const useReturn = (params: ReturnSlipQueryParams | undefined) => {
  const cleanedParams = cleanParams(params as ReturnSlipQueryParams);
  const queryResult = useQuery({
    queryKey: ['returnSlip', cleanedParams],
    queryFn: () => getReturnSlips(cleanedParams as ReturnSlipQueryParams),
  });
  return {
    ...queryResult,
    refetch: queryResult.refetch,
  };
};

export const useUpdateReturnSlip = () => {
  const queryClient = useQueryClient();
  return useMutation(
    ({
      returnId,
      status,
      reason,
    }: {
      returnId: number;
      status: ReturnStatus;
      reason: string;
    }) => updateReturnSlip(returnId, status, reason),
    {
      onSuccess: (data: AxiosResponse) => {
        queryClient.invalidateQueries(['returnSlip']);
        console.log('data', data);
      },
      onError: (error: any) => {
        message.error(error.message || 'Failed to update status.');
      },
    },
  );
};
