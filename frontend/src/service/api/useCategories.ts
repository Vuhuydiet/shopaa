import axios from 'axios';
import { useQuery } from 'react-query';
import { PRODUCT_API_ENDPOINTS } from '../../config/API_config';
import { ICategory } from '../../interfaces/ICategory';

export const useCategories = () => {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => getCategories(),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

const getCategories = async () => {
  try {
    const response = await axios.get(PRODUCT_API_ENDPOINTS.CATEGORY, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.data?.metadata) {
      const categories = response.data.metadata.map(
        (category: any): ICategory => ({
          id: category.categoryId,
          name: category.categoryName,
          description: category.description,
        }),
      );
      console.log('categories:', categories);
      return categories;
    }
  } catch (error) {
    console.error('Error fetching categories:', error);
  }
  return [];
};
