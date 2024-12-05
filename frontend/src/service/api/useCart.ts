import { QueryFunctionContext, useQuery } from 'react-query';
import { ICart } from '../../interfaces/ICart';

export const useCart = () => {
  return useQuery({
    queryKey: 'carts',
    queryFn: getAllProductsInCart,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

async function getAllProductsInCart(
  context: QueryFunctionContext<'carts', any>,
): Promise<ICart> {
  const response = await fetch('http://localhost:3000/api/v1/cart', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`,
    },
  });

  console.log(response.json());

  if (!response.ok) {
    throw new Error('Something went wrong');
  }

  return response.json();
}
