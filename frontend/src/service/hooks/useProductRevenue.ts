import { useContext } from 'react';
import { ProductRevenueContext } from '../../context/ProductRevenueContext';

export const useProductRevenue = () => {
  return useContext(ProductRevenueContext);
};
