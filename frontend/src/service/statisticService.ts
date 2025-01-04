import axios from 'axios';
import { STATISTICS_API_ENDPOINTS } from '../config/API_config';
import {
  IOrderStatsData,
  IProductStatsData,
  IRevenueData,
} from '../interfaces/IStatisticOfShop';
const getToken = () => {
  return localStorage.getItem('token');
};

export const getRevenueByYear = async (year: number, shopId?: number) => {
  try {
    const response = await axios.get(STATISTICS_API_ENDPOINTS.REVENUE, {
      params: { year, shopId },
      headers: {
        Authorization: `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
    });
    if (response.data?.metadata.revenue) {
      const result: IRevenueData[] = response.data?.metadata?.revenue?.map(
        (item: any): IRevenueData => {
          return {
            month: item.month,
            totalRevenue: item.totalRevenue,
            year: item.year,
          };
        },
      );
      return result;
    }
  } catch (error) {
    console.error('Error fetching revenue:', error);
  }
  return null;
};

export const getProductRevenueByYear = async (
  year: number,
  shopId?: number,
) => {
  try {
    const response = await axios.get(STATISTICS_API_ENDPOINTS.PRODUCTS, {
      params: { year, shopId },
      headers: {
        Authorization: `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
    });
    if (response.data?.metadata?.productStats) {
      const result: IProductStatsData[] =
        response.data?.metadata?.productStats?.map(
          (item: any): IProductStatsData => {
            return {
              month: item.month,
              productName: item.productName,
              totalRevenue: item.totalRevenue,
              year: item.year,
            };
          },
        );
      return result;
    }
  } catch (error) {
    console.error('Error fetching product revenue:', error);
  }
  return null;
};

export const getOrderStatusByYear = async (year: number, shopId?: number) => {
  try {
    const response = await axios.get(STATISTICS_API_ENDPOINTS.ORDERS, {
      params: { year, shopId },
      headers: {
        Authorization: `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
    });
    if (response.data?.metadata?.orderStats) {
      const result: IOrderStatsData[] = response.data?.metadata?.orderStats.map(
        (item: any): IOrderStatsData => {
          return {
            month: item.month,
            orderStatus: item?.orderStatus,
            totalOrder: item?.totalOrders,
            year: item.year,
          };
        },
      );
      return result;
    }
  } catch (error) {
    console.error('Error fetching order status:', error);
  }
  return null;
};
