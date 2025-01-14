import axios from 'axios';
import { REPORT_API_ENDPOINTS } from '../../config/API_config';

export const getReportReasons = async (type: string) => {
  try {
    const response = await axios.get(REPORT_API_ENDPOINTS.REASONS, {
      params: { type },
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const reasons = await response.data.metadata.reasons.map(
      (reason: any) => reason.categoryName,
    );

    return reasons;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const postReport = async (type: string, data: any) => {
  try {
    const response = await axios.post(
      type === 'product'
        ? REPORT_API_ENDPOINTS.PRODUCT
        : REPORT_API_ENDPOINTS.SHOP,
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      },
    );

    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
