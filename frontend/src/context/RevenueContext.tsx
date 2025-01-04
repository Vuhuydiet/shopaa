import axios from 'axios';
import { createContext, ReactNode, useState } from 'react';
import { useQuery } from 'react-query';
import { STATISTICS_API_ENDPOINTS } from '../config/API_config';
import { IRevenue } from '../interfaces/IRevenue';

interface RevenueProviderProps {
  children: ReactNode;
}

interface RevenueContextType {
  year: number;
  setYear: (year: number) => void;
  revenues: IRevenue[];
}

export const RevenueContext = createContext<RevenueContextType>({
  year: new Date().getFullYear(),
  setYear: () => {},
  revenues: [],
});

const RevenueProvider = ({ children }: RevenueProviderProps) => {
  const [year, setYear] = useState<number>(new Date().getFullYear());

  const revenues = useQuery({
    queryKey: ['revenue', year],
    queryFn: async () => {
      try {
        const response = await axios.get(STATISTICS_API_ENDPOINTS.REVENUE, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          params: {
            year,
          },
        });
        console.log('revenue', response.data?.metadata?.revenue);

        return response.data?.metadata?.revenue;
      } catch (error) {
        console.error('Error fetching revenue:', error);
        throw error;
      }
    },
  });

  return (
    <RevenueContext.Provider
      value={{ year, setYear, revenues: revenues.data ?? [] }}
    >
      {children}
    </RevenueContext.Provider>
  );
};

export default RevenueProvider;
