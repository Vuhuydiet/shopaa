import axios from 'axios';
import {
  IReturnSlip,
  ReturnSlipQueryParams,
} from '../interfaces/Order/IReturnSlip';
import { RETURN_API_ENDPOINTS } from '../config/API_config';

export const getReturnSlips = async (queryParams: ReturnSlipQueryParams) => {
  try {
    const response = await axios.get(RETURN_API_ENDPOINTS.RETURN, {
      params: queryParams,
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
        'Content-Type': 'application/json',
      },
    });
    if (response.data?.metadata?.returnSlips) {
      const returnSlips = response.data.metadata?.returnSlips?.map(
        (returnSlip: any): IReturnSlip => {
          return {
            returnId: returnSlip?.returnId,
            orderId: returnSlip?.orderId,
            createdAt: returnSlip?.createdAt,
            status: returnSlip?.status,
            reason: returnSlip?.reason,
            description: returnSlip?.description,
            result: returnSlip?.result,
            createdAtOrder: returnSlip?.order?.createdAt,
            customerName: returnSlip?.order?.customer?.fullname,
            totalAmount: returnSlip?.order?.totalAmount,
            customerNumber: returnSlip?.order?.customerNumber,
            shippingFee: returnSlip?.order?.shippingFee,
            shippingAddress: returnSlip?.order?.shippingAddress,
          };
        },
      );
      return { count: response.data?.metadata?.count | 0, items: returnSlips };
    }
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const getReturnSlipById = async (returnId: number) => {
  try {
    const response = await axios.get(
      `${RETURN_API_ENDPOINTS.RETURN}/${returnId}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data.metadata.returnSlip;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};

export const updateReturnSlip = async (
  returnId: number,
  status: string,
  reason: string,
) => {
  try {
    const response = await axios.put(
      `${RETURN_API_ENDPOINTS.RETURN}/${returnId}`,
      {
        status,
        reason,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      },
    );
    return response.data.message;
  } catch (error: any) {
    throw new Error(error.response.data.message);
  }
};
