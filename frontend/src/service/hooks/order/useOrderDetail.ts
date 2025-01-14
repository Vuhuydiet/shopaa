import { useQuery } from 'react-query';
import axios from 'axios';
import { ORDER_API_ENDPOINTS } from '../../../config/API_config';

export const useOrderDetail = (id: string) => {
  return useQuery({
    queryKey: ['order', id],
    queryFn: () => getOrderDetail(id),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

async function getOrderDetail(id: string) {
  try {
    const response = await axios.get(
      `${ORDER_API_ENDPOINTS.ORDER_DETAIL}/${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      },
    );
    console.log(response);
  } catch (error) {
    console.error('Error fetching products:', error);
  }
}
