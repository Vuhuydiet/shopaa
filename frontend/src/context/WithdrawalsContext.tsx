import { createContext, ReactNode, useState } from 'react';
import { IWithdrawals } from '../interfaces/IWithdrawals';
import { useQuery } from 'react-query';
import axios from 'axios';
import { STATISTICS_API_ENDPOINTS } from '../config/API_config';

interface WithdrawalsProviderProps {
  children: ReactNode;
}

interface WithdrawalsContextType {
  withdrawals: IWithdrawals[];
  year: number;
  setYear: (year: number) => void;
}

const WithdrawalsContext = createContext<WithdrawalsContextType>({
  withdrawals: [],
  year: new Date().getFullYear(),
  setYear: () => {},
});

const WithdrawalsProvider = ({ children }: WithdrawalsProviderProps) => {
  const [year, setYear] = useState(new Date().getFullYear());

  const withdrawals = useQuery({
    queryKey: ['withdrawals', year],
    queryFn: async () => {
      try {
        const response = await axios.get(STATISTICS_API_ENDPOINTS.WITHDRAWALS, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          params: { year },
        });

        return response.data?.metadata?.withdrawalStats;
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
  });

  return (
    <WithdrawalsContext.Provider
      value={{ withdrawals: withdrawals.data ?? [], year, setYear }}
    >
      {children}
    </WithdrawalsContext.Provider>
  );
};

export { WithdrawalsProvider, WithdrawalsContext };
