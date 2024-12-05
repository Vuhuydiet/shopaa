import { QueryFunctionContext, useQuery } from 'react-query';
import { ICart } from '../../interfaces/ICart';
import axios from 'axios';
import {
  CART_API_ENDPOINTS,
  PRODUCT_API_ENDPOINTS,
} from '../../config/API_config';

interface ICartParams {
  limit: number;
  offset: number;
}

export const useCart = (params: ICartParams) => {
  return useQuery({
    queryKey: 'carts',
    queryFn: () => getAllProductsInCart(params),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

async function getAllProductsInCart(params: ICartParams) {
  if (!localStorage.getItem('token')) {
    throw new Error('Unauthorized');
  }

  try {
    const response = await axios.get(CART_API_ENDPOINTS.CART, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const cartItems = response.data?.metadata?.cartItems;
    if (cartItems) {
      return cartItems.map((item: any) => {
        return {
          key: item?.shop?.shopOwnerId,
          shopName: item?.shop?.shopName,
          description: item?.product?.description,
          address: item?.shop?.address,
          bankingBalance: item?.shop?.bankingBalance,
          products: item?.products.map(async (product: any) => {
            const response = await axios.get(
              `${PRODUCT_API_ENDPOINTS.PRODUCTS}/${product?.productId}`,
            );
            const prod = response.data?.metadata?.product;

            return {
              key: product?.productId,
              shopId: item?.shop?.shopOwnerId,
              name: product?.productName,
              currentPrice: product?.currentPrice,
              originalPrice: prod?.originalPrice,
              color: product?.color,
              size: product?.size,
              colors: prod?.colors,
              sizes: prod?.sizes,
              image: product?.imageUrl,
            };
          }),
        };
      });
    }
  } catch (error) {
    throw error;
  }

  return {} as ICart;
}
