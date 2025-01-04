import { useContext } from 'react';
import { RevenueContext } from '../../context/RevenueContext';

export const useRevenue = () => {
  return useContext(RevenueContext);
};
