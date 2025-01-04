import { WithdrawQuery } from '../../interfaces/IWithDraw';
import { getAllWithdrawRequest } from '../withdrawService';
import { useQuery } from 'react-query';

const cleanParams = (params: WithdrawQuery): WithdrawQuery => {
  const cleanedParams = Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) => value !== null && value !== undefined && value !== '',
    ),
  );
  return cleanedParams as WithdrawQuery;
};

export const useWithdraw = (param: WithdrawQuery | undefined) => {
  const cleanedParams = cleanParams(param as WithdrawQuery);
  const queryResult = useQuery({
    queryKey: ['withdraw', cleanedParams],
    queryFn: () => getAllWithdrawRequest(cleanedParams as WithdrawQuery),
  });
  return {
    ...queryResult,
    refetch: queryResult.refetch,
  };
};
