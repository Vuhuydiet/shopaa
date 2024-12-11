import { IQueryOrder } from '../../../interfaces/Order/IQueryOrder';
import { useQuery, useMutation, useQueryClient } from 'react-query';
import { getOrders, updateStatusOrder } from '../../orderService';
import { OrderStatus } from '../../../interfaces/Order/OrderEnums';
const cleanParams = (params: Record<string, any>) => {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([_, value]) => value !== null && value !== undefined && value !== '',
    ),
  );
};

export const useOrders = (params: IQueryOrder) => {
  const filteredParams = cleanParams(params);
  return useQuery({
    queryKey: ['orders', filteredParams],
    queryFn: () => getOrders(filteredParams),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

export const useUpdateOrderStatus = () => {
  const queryClient = useQueryClient();

  return useMutation(
    ({ orderId, status }: { orderId: number; status: OrderStatus }) =>
      updateStatusOrder(orderId, status),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['orders']);
      },
    },
  );
};
