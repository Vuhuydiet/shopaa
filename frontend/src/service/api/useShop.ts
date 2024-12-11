import axios from 'axios';
import { useQuery } from 'react-query';
import { SHOP_API_ENDPOINTS } from '../../config/API_config';
import { IShop } from '../../interfaces/IShop';

export const useShop = (id: string | undefined) => {
  return useQuery({
    queryKey: ['shop', id],
    queryFn: () => fetchShopDetail(id),
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};

async function fetchShopDetail(id: string | undefined) {
  if (!id) return {} as IShop;

  const res = await axios.get(`${SHOP_API_ENDPOINTS.SHOP}${id}`);
  const data = res?.data;

  try {
    if (data?.metadata?.shop) {
      const shop = data.metadata.shop;
      return {
        shopOwnerId: shop.shopOwnerId,
        name: shop.shopName,
        description: shop.shopDescription,
        address: shop.address,
      } as IShop;
    }
  } catch (error) {
    console.log(error);
  }

  return {} as IShop;
}
