import axios from 'axios';
import { WITHDRAW_API_ENDPOINTS } from '../config/API_config';
import { WithdrawQuery } from '../interfaces/IWithDraw';

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
      return response.data.metadata;
    }
  } catch (error) {
    console.error('Error fetching withdraws:', error);
  }
  return [];
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
      return response.data.metadata;
    }
  } catch (error) {
    console.error('Error fetching withdraw:', error);
  }
  return [];
};

export const getWithdrawForShop = async (shopId: number) => {
  try {
    const response = await axios.get(
      `${WITHDRAW_API_ENDPOINTS.WITHDRAW}/shop/${shopId}`,
      {
        headers: {
          Authorization: `Bearer ${getToken()}`,
          'Content-Type': 'application/json',
        },
      },
    );
    if (response.data?.metadata) {
      return response.data.metadata;
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

export const createWithdrawHistory = async (withdrawData: Object) => {
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
