import { useMutation, useQueryClient } from 'react-query';
import axios from 'axios';
import { IProduct } from '../../interfaces/IProduct';
import { AUTH_API_ENDPOINTS } from '../../config/API_config';

async function addProduct(productData: IProduct) {
  try {
    const respone = await axios.post(AUTH_API_ENDPOINTS.PRODUCTS, productData, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return respone.data;
  } catch (error) {
    console.log('Error adding product: ', error);
    throw error;
  }
}

export const useAddProduct = () => {
  const queryClient = useQueryClient();
  return useMutation(addProduct, {
    onSuccess: () => {
      queryClient.invalidateQueries('products');
    },
  });
};
