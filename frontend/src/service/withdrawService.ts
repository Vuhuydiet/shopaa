import axios from 'axios';
import { WITHDRAW_API_ENDPOINTS } from '../config/API_config';
import { IWithdraw, WithdrawQuery } from '../interfaces/IWithDraw';

const getToken = () => {
  return localStorage.getItem('token');
};

export const getAllWithdrawRequest = async (param: WithdrawQuery) => {
  try {
    const response = await axios.get(WITHDRAW_API_ENDPOINTS.WITHDRAW, {
      params: param,
      headers: {
        Authorization: `Bearer ${getToken()}`,
        'Content-Type': 'application/json',
      },
    });
    if (response.data?.metadata) {
      const result: IWithdraw[] = response.data?.metadata?.map(
        (item: any): IWithdraw => ({
          requestId: item?.requestId,
          handlerId: item?.requesthistory?.handler,
          shopId: item?.shopOwnerId,
          amount: item?.amount,
          status: item?.requesthistory?.status,
          createdAt: item?.createdAt,
          updatedAt: item?.requesthistory?.createdAt,
          note: item?.requesthistory?.note,
          shopName: item?.shopName,
        }),
      );
      return { items: result, count: result.length | 0 };
    }
  } catch (error) {
    console.error('Error fetching withdraws:', error);
  }
  return { items: [], count: 0 };
};

export const getWithdrawById = async (requestId: number) => {
  try {
    const response = await axios.get(
      `${WITHDRAW_API_ENDPOINTS.WITHDRAW}/${requestId}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'Content-Type': 'application/json',
        },
      },
    );
    if (response.data?.metadata) {
      const result: IWithdraw = {
        requestId: response.data.metadata?.request?.requestId,
        handlerId: response.data.metadata?.request?.requesthistory?.handler,
        shopId: response.data.metadata?.request?.shopOwnerId,
        amount: response.data.metadata?.request?.amount,
        status: response.data.metadata?.request?.requesthistory?.status,
        createdAt: response.data.metadata?.request?.createdAt,
        updatedAt: response.data.metadata?.request?.requesthistory?.createdAt,
        note: response.data.metadata?.request?.requesthistory?.note,
        shopName: response.data.metadata?.request?.shopName,
      };
      return result;
    }
  } catch (error) {
    console.error('Error fetching withdraw:', error);
  }
  return [];
};

export const getWithdrawForShop = async () => {
  try {
    const response = await axios.get(
      `${WITHDRAW_API_ENDPOINTS.WITHDRAW}/shop`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'Content-Type': 'application/json',
        },
      },
    );
    if (response.data?.metadata) {
      const result: IWithdraw[] = response.data?.metadata?.map(
        (item: any): IWithdraw => ({
          requestId: item?.requestId,
          handlerId: item?.requesthistory?.handler,
          shopId: item?.shopOwnerId,
          amount: item?.amount,
          status: item?.requesthistory?.status,
          createdAt: item?.createdAt,
          updatedAt: item?.requesthistory?.createdAt,
          note: item?.requesthistory?.note,
          shopName: item?.shopName,
        }),
      );
      return result;
    }
  } catch (error) {
    console.error('Error fetching withdraw:', error);
  }
  return [];
};

export const createWithdrawRequest = async (withdrawData: Object) => {
  try {
    const response = await axios.post(
      WITHDRAW_API_ENDPOINTS.WITHDRAW,
      withdrawData,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'Content-Type': 'application/json',
        },
      },
    );

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
        throw new Error('Server not responding. Please try again later');
      }
    }
  }
};

export const createWithdrawHistory = async (
  requestId: number,
  withdrawData: Object,
) => {
  try {
    const response = await axios.post(
      `${WITHDRAW_API_ENDPOINTS.WITHDRAW}${requestId}`,
      withdrawData,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'Content-Type': 'application/json',
        },
      },
    );

    if (response.status >= 200 && response.status < 300) {
      return response.data.message;
    }

    throw new Error(response.data.message || 'Unknown error occurred');
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        throw new Error(
          error.response.data.message || 'Server responded with an error',
        );
      }
      if (error.request) {
        throw new Error('Server not responding. Please try again later');
      }
    }
  }
};

export const deleteWithdrawRequest = async (requestId: number) => {
  try {
    const response = await axios.delete(
      `${WITHDRAW_API_ENDPOINTS.WITHDRAW}/${requestId}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'Content-Type': 'application/json',
        },
      },
    );
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
        throw new Error('Server not responding. Please try again later');
      }
    }
  }
};
