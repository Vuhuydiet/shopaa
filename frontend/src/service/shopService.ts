import { SHOP_API_ENDPOINTS } from '../config/API_config';
import { IShop } from '../interfaces/IShop';

export const getShop = async (shopId: number, token?: string) => {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(`${SHOP_API_ENDPOINTS.SHOP}${shopId}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Error fetching shop: ${response.statusText}`);
    }
    const data = await response.json();
    console.log('data:', data);
    const infoShop: IShop = {
      shopOwnerId: data?.metadata?.shop?.shopOwnerId,
      name: data?.metadata?.shop?.shopName,
      description: data?.metadata?.shop?.shopDescription,
      address: data?.metadata?.shop?.address,
      bankBalance: data?.metadata?.shop?.bankBalance,
      numProducts: data?.metadata?.shop?.numProducts,
      numSoldOrders: data?.metadata?.shop?.numSoldOrders,
      numReviews: data?.metadata?.shop?.numReviews,
      totalRating: data?.metadata?.shop?.totalRating,
    };
    return infoShop;
  } catch (error) {
    console.error('Error in getShop: ', error);
    throw error;
  }
};

// REGISTER SHOP
export const registerShop = async (token: string, shopData: any) => {
  try {
    const response = await fetch(`${SHOP_API_ENDPOINTS.REGISTER_SHOP}`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ shopData: shopData }),
    });

    if (!response.ok) {
      throw new Error(`Error registering shop: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in registerShop: ', error);
    throw error;
  }
};

// UPDATE SHOP
export const updateShop = async (token: string, shopData: any) => {
  try {
    const response = await fetch(`${SHOP_API_ENDPOINTS.SHOP}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ shopData: shopData }),
    });

    if (!response.ok) {
      throw new Error(`Error updating shop: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in updateShop: ', error);
    throw error;
  }
};

// DELETE SHOP
export const deleteShop = async (token: string) => {
  try {
    const response = await fetch(`${SHOP_API_ENDPOINTS.SHOP}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error deleting shop: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error in deleteShop: ', error);
    throw error;
  }
};
