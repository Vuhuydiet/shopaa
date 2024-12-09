import { useQuery } from 'react-query';
import { ICart } from '../../interfaces/ICart';
import axios from 'axios';
import { CART_API_ENDPOINTS } from '../../config/API_config';

interface ICartParams {
  limit?: number;
  offset?: number;
}

export const useCart = (params: ICartParams) => {
  return {
    cart: useQuery({
      queryKey: ['cart', params],
      queryFn: () => getAllProductsInCart(params),
    }),
    deleteItem: (cartItemId: number) => {
      deleteItemInCart(cartItemId);
    },
  };
};

const deleteItemInCart = async (cartItemId: number) => {
  if (!localStorage.getItem('token')) {
    throw new Error('Unauthorized');
  }

  try {
    const response = await axios.delete(
      `${CART_API_ENDPOINTS.CART}/${cartItemId}`,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

async function getAllProductsInCart(params: ICartParams) {
  if (!localStorage.getItem('token')) {
    throw new Error('Unauthorized');
  }

  try {
    const response = await axios.get(CART_API_ENDPOINTS.CART, {
      params: params,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    const cartItems = response.data?.metadata?.cartItems;

    if (cartItems) {
      const result = cartItems.map((item: any) => {
        return {
          key: item?.shop?.shopOwnerId,
          shopName: item?.shop?.shopName,
          description: item?.shop?.shopDescription,
          address: item?.shop?.address,
          bankingBalance: item?.shop?.bankingBalance,
          products: item?.products?.map((product: any) => {
            return {
              key: product?.cartItemId,
              id: product?.productId,
              shopId: item?.shop?.shopOwnerId,
              name: product?.productName,
              currentPrice: product?.currentPrice,
              originalPrice: product?.originalPrice,
              color: product?.color,
              size: product?.size,
              colors: product?.availableColors,
              sizes: product?.availableSizes,
              image: product?.imageUrl,
              quantity: 1,
            };
          }),
        };
      });

      console.log('cart: ', result);
      return result;
    }
  } catch (error) {
    throw error;
  }

  return {} as ICart;
}
