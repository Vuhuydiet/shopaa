import { IQueryOrder } from '../../../interfaces/Order/IQueryOrder';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getOrders, updateStatusOrder } from '../../orderService';
import { OrderStatus } from '../../../interfaces/Order/OrderEnums';
import { message } from 'antd';
const cleanParams = (params: IQueryOrder): IQueryOrder => {
  const cleanedParams = Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) => value !== null && value !== undefined && value !== '',
    ),
  );
  return cleanedParams as IQueryOrder;
};

export const useOrders = (params: IQueryOrder) => {
  const filteredParams = cleanParams(params);
  const queryResult = useQuery({
    queryKey: ['orders', filteredParams],
    queryFn: () => getOrders(filteredParams),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
  return {
    ...queryResult,
    refetch: queryResult.refetch,
  };
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation(
    async ({ orderId, status }: { orderId: number; status: OrderStatus }) => {
      if (status === OrderStatus.RETURN_REQUESTED) {
        console.log('Return requested');
        return Promise.resolve({
          mes: 'Data refreshed without updating status.',
        });
      }
      return updateStatusOrder(orderId, status);
    },
    {
      onSuccess: (data, variables) => {
        console.log('data', data);
        queryClient.invalidateQueries(['orders']);
        if (variables.status === OrderStatus.RETURN_REQUESTED) {
          message.success('Return request submitted successfully');
        } else {
          message.success(data.mes || 'Status updated successfully!');
        }
      },
      onError: (error: any) => {
        message.error(error.message || 'Failed to update status.');
      },
    },
  );
};
