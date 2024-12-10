import { ORDER_API_ENDPOINTS } from '../../../config/API_config';
import { useQuery } from 'react-query';
import axios from 'axios';
import { IQueryOrder } from '../../../interfaces/Order/IQueryOrder';
import { IOrder } from '../../../interfaces/Order/IOrder';

export const useOrders = (params: IQueryOrder) => {
  return useQuery({
    queryKey: ['orders', params],
    queryFn: () => getOrders(params),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

async function getOrders(params: IQueryOrder = { limit: 10 }) {
  try {
    const response = await axios.get(ORDER_API_ENDPOINTS.ORDER, {
      params: params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    if(response.data?.metadata?.orders) {
      const orders = response.data.metadata?.orders?.map((order: any) : IOrder => {
        return {
          orderId: order?.orderId,
          // // customerName: order?.customerName,
          // phoneNumber: order?.phoneNumber,
          // status: order?.status,
          // totalAmount: order?.totalAmount,
          // createdAt: order?.createdAt,
        };
      }
    }

    console.log(response);
    return { count: 2 };
  } catch (error) {
    console.error('Error fetching products:', error);
  }
  return { count: 0, items: [] };
}
