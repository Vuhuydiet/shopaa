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
      { status },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      },
    );
    if (response.status >= 200 && response.status < 300) {
      return response.data.message;
    } else {
      throw new Error(`Error update status order: ${response.data.message}`);
    }
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const getOrders = async (params: IQueryOrder = { limit: 10 }) => {
  try {
    const response = await axios.get(ORDER_API_ENDPOINTS.ORDER, {
      params,
      paramsSerializer: (params) => {
        const serializedParams: any = [];
        if (params.status && Array.isArray(params.status)) {
          params.status.forEach((status) => {
            serializedParams.push(`status=${encodeURIComponent(status)}`);
          });
          delete params.status;
        }
        Object.entries(params).forEach(([key, value]) => {
          if (value !== undefined && value !== null && value !== '') {
            serializedParams.push(
              `${encodeURIComponent(key)}=${encodeURIComponent(value)}`,
            );
          }
        });
        return serializedParams.join('&');
      },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    console.log('Orders == service:', response.data.metadata.orders);
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
      console.log('Order Detail == service:', response.data.metadata.order);
      const order = response.data.metadata?.order;
      const orderDetail: IOrderDetail = {
        orderId: order?.orderId,
        customerId: order?.customerId,
        customerName: order?.customer?.fullname,
        customerNumber: order?.customerNumber,
        shopId: order?.shopId,
        shopName: order?.shop?.shopName,
        shippingAddress: order?.shippingAddress,
        status: order?.status,
        createdAt: order?.createdAt,
        updatedAt: order?.updatedAt,
        shippingFee: order?.shippingFee,
        totalAmount: order?.totalAmount,
        orderProducts: order?.orderProducts.map((product: IProductOrder) => {
          return {
            orderId: order?.orderId,
            orderDetailNumber: product?.orderDetailNumber,
            productId: product?.productId,
            productName: product?.productName,
            productImageUrl: product?.productImageUrl,
            quantity: product?.quantity,
            price: product?.price,
            color: product?.color,
            size: product?.size,
            status: order?.status,
            updatedAt: order?.updatedAt,
            isReviewed: product?.isReviewed,
          };
        }),
        transportationProvider: {
          providerId: order?.transportationProvider?.providerId,
          providerName: order?.transportationProvider?.providerName,
        },
      };

      console.log(orderDetail);
      return orderDetail;
    }
  } catch (error) {
    console.error('Error fetching order detail:', error);
  }

  return null;
};

export const getTransportationInfo = async () => {
  try {
    const response = await axios.get(ORDER_API_ENDPOINTS.TRANSPORTATION);
    if (response.data?.metadata) {
      return response.data.metadata;
    }
  } catch (error) {
    console.error('Error fetching transportation providers:', error);
  }
  return [];
};

export const createOrder = async (orderData: Object) => {
  try {
    const response = await axios.post(ORDER_API_ENDPOINTS.ORDER, orderData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status >= 200 && response.status < 300) {
      return response.data.message;
    } else {
      throw new Error(response.data.message || 'Unknown error occurred');
    }
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(
          error.response.data.message || 'Server responded with an error',
        );
      }
      if (error.request) {
        throw new Error(
          'No response from server. Please check your network connection.',
        );
      }
      throw new Error(error.message || 'Unexpected Axios error occurred');
    } else {
      throw new Error(error.message || 'An unexpected error occurred');
    }
  }
};
