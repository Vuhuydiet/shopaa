import { OrderStatus } from '../interfaces/Order/OrderEnums';
import { ORDER_API_ENDPOINTS } from '../config/API_config';
import { IQueryOrder } from '../interfaces/Order/IQueryOrder';
import { IOrder } from '../interfaces/Order/IOrder';
import axios from 'axios';
import { IOrderDetail } from '../interfaces/Order/IOrderDetail';
import { IProductOrder } from '../interfaces/Order/IProductOrder';

export const updateStatusOrder = async (
  orderId: number,
  status: OrderStatus,
) => {
  try {
    const response = await axios.patch(
      `${ORDER_API_ENDPOINTS.ORDER}${orderId}`,
      { status }, // Truyền đối tượng với status
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      },
    );
    if (response.status >= 200 && response.status < 300) {
      return response.data; // Trả về dữ liệu từ API
    } else {
      throw new Error(`Error update status order: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error in updateStatusOrder: ', error);
    throw error;
  }
};

export const getOrders = async (params: IQueryOrder = { limit: 10 }) => {
  try {
    const response = await axios.get(ORDER_API_ENDPOINTS.ORDER, {
      params: params,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    if (response.data?.metadata?.orders && response.data?.metadata?.count) {
      const orders = response.data.metadata?.orders?.map(
        (order: any): IOrder => {
          return {
            orderId: order?.orderId,
            customerId: order?.customerId,
            customerNumber: order?.customerNumber,
            shopId: order?.shopId,
            shippingAddress: order?.shippingAddress,
            status: order?.status,
            createdAt: order?.createdAt,
            updatedAt: order?.updatedAt,
            shippingFee: order?.shippingFee,
            totalAmount: order?.totalAmount,
          };
        },
      );
      return { count: response.data?.metadata?.count, items: orders };
    }
  } catch (error) {
    console.error('Error fetching orders:', error);
  }
  return { count: 0, items: [] };
};

export const getOrderDetail = async (id: number) => {
  try {
    const response = await axios.get(
      `${ORDER_API_ENDPOINTS.ORDER_DETAIL}${id}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      },
    );
    if (response.data?.metadata?.order) {
      const order = response.data.metadata?.order;
      const orderDetail: IOrderDetail = {
        orderId: order?.orderId,
        customerId: order?.customerId,
        customerName: order?.customer?.fullname,
        customerNumber: order?.customerNumber,
        shopId: order?.shopId,
        shippingAddress: order?.shippingAddress,
        status: order?.status,
        createdAt: order?.createdAt,
        updatedAt: order?.updatedAt,
        shippingFee: order?.shippingFee,
        totalAmount: order?.totalAmount,
        orderProducts: order?.orderProducts.map((product: IProductOrder) => {
          return {
            productId: product?.productId,
            productName: product?.productName,
            productImageUrl: product?.productImageUrl,
            quantity: product?.quantity,
            price: product?.price,
            color: product?.color,
            size: product?.size,
          };
        }),
        transportationProvider: {
          providerId: order?.transportationProvider?.providerId,
          providerName: order?.transportationProvider?.providerName,
        },
      };
      return orderDetail;
    }
  } catch (error) {
    console.error('Error fetching order detail:', error);
  }

  return null;
};
