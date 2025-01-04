import { useContext } from 'react';
import { OrderStatisticContext } from '../../context/OrderStatisticContext';

export const useOrderStatistics = () => {
  return useContext(OrderStatisticContext);
};
