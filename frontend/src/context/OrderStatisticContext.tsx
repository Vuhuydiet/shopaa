import { createContext, ReactNode, useState } from 'react';
import { IOrderStatistics } from '../interfaces/IOrderStatistics';
import { useQuery } from 'react-query';
import axios from 'axios';
import { STATISTICS_API_ENDPOINTS } from '../config/API_config';

interface OrderStatisticProviderProps {
  children: ReactNode;
}

interface OrderStatisticContextType {
  year: number;
  setYear: (year: number) => void;
  orderStatistics: IOrderStatistics[];
}

export const OrderStatisticContext = createContext<OrderStatisticContextType>({
  year: new Date().getFullYear(),
  setYear: () => {},
  orderStatistics: [],
});

const OrderStatisticProvider = ({ children }: OrderStatisticProviderProps) => {
  const [year, setYear] = useState<number>(new Date().getFullYear());

  const orderStatistics = useQuery({
    queryKey: ['orderStatistics', year],
    queryFn: async () => {
      try {
        const response = await axios.get(STATISTICS_API_ENDPOINTS.ORDERS, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          params: {
            year,
          },
        });
        console.log('orderStatistics', response.data?.metadata?.orderStats);

        return response.data?.metadata?.orderStats;
      } catch (error) {
        console.error('Error fetching order statistics:', error);
        throw error;
      }
    },
  });

  return (
    <OrderStatisticContext.Provider
      value={{ year, setYear, orderStatistics: orderStatistics.data }}
    >
      {children}
    </OrderStatisticContext.Provider>
  );
};

export default OrderStatisticProvider;
