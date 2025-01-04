import { createContext } from 'react';
import { IProductRevenue } from '../interfaces/IProductRevenue';
import { ReactNode, useState } from 'react';
import { STATISTICS_API_ENDPOINTS } from '../config/API_config';
import axios from 'axios';
import { useQuery } from 'react-query';

interface ProductRevenueProviderProps {
  children: ReactNode;
}

interface ProductRevenueContextType {
  year: number;
  setYear: (year: number) => void;
  productRevenues: IProductRevenue[];
}

export const ProductRevenueContext = createContext<ProductRevenueContextType>({
  year: new Date().getFullYear(),
  setYear: () => {},
  productRevenues: [],
});

const ProductRevenueProvider = ({ children }: ProductRevenueProviderProps) => {
  const [year, setYear] = useState<number>(new Date().getFullYear());

  const productRevenues = useQuery({
    queryKey: ['productRevenue', year],
    queryFn: async () => {
      try {
        const response = await axios.get(STATISTICS_API_ENDPOINTS.PRODUCTS, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          params: {
            year,
          },
        });
        console.log('productRevenue', response.data?.metadata?.productStats);

        return response.data?.metadata?.productStats;
      } catch (error) {
        console.error('Error fetching product revenue:', error);
        throw error;
      }
    },
  });

  return (
    <ProductRevenueContext.Provider
      value={{ year, setYear, productRevenues: productRevenues.data ?? [] }}
    >
      {children}
    </ProductRevenueContext.Provider>
  );
};

export default ProductRevenueProvider;
