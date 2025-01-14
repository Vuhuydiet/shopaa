import { useMutation, useQuery, useQueryClient } from 'react-query';
import { ICart } from '../../interfaces/ICart';
import axios, { AxiosResponse } from 'axios';
import { CART_API_ENDPOINTS } from '../../config/API_config';

interface ICartParams {
  limit?: number;
  offset?: number;
}

interface IProduct {
  productId: number;
  color?: string;
  size?: string;
}

interface ICartResponse {
  cart: ICart[];
  count: number;
}

export const useCart = (params: ICartParams | undefined) => {
  const queryClient = useQueryClient();

  return {
    cart: useQuery({
      queryKey: ['cart', params],
      queryFn: () => getAllProductsInCart(params),
    }),
    deleteItem: useMutation({
      mutationKey: ['delete-cart'],
      mutationFn: (cartItemId: number) => deleteItemInCart(cartItemId),
      onSuccess: () => {
        queryClient.invalidateQueries('cart');
      },
    }),
    addItem: useMutation({
      mutationKey: ['add-cart'],
      mutationFn: (product: IProduct) => addItemToCart(product),
      onSuccess: () => {
        queryClient.invalidateQueries('cart');
      },
    }),
  };
};

const addItemToCart = async (product: IProduct): Promise<AxiosResponse> => {
  if (!localStorage.getItem('token')) {
    throw new Error('Unauthorized');
  }

  try {
    const response = await axios.post(CART_API_ENDPOINTS.CART, product, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    if (response.status >= 400) {
      throw new Error('Bad response from server');
    }

    return response;
  } catch (error) {
    throw error;
  }
};

const deleteItemInCart = async (cartItemId: number): Promise<AxiosResponse> => {
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

    console.log('test', response);

    if (response.status >= 400) {
      throw new Error('Bad response from server');
    }

    return response;
  } catch (error) {
    throw error;
  }
};

async function getAllProductsInCart(params: ICartParams | undefined) {
  if (!params) {
    return;
  }

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
    if (response.status >= 400) {
      throw new Error('Bad response from server');
    }

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
      return {
        cart: result || [],
        count: response.data?.metadata?.count || 0,
      } as ICartResponse;
    }
  } catch (error) {
    throw error;
  }
}
