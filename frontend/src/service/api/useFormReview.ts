import { message } from 'antd';
import axios from 'axios';
import { useMemo, useState } from 'react';
import { REVIEW_API_ENDPOINTS } from '../../config/API_config';
import { IProductOrder } from '../../interfaces/Order/IProductOrder';

export const useFormReview = (order: IProductOrder) => {
  const desc = useMemo(
    () => ['Very bad', 'Bad', 'Normal', 'Good', 'Very good'],
    [],
  );

  const [star, setStar] = useState(5);
  const [content, setContent] = useState('');

  const handleSubmitReview = () => {
    if (!star) {
      message.error('Please rate the product');
      return;
    }

    if (!content) {
      message.error('Please write a review');
      return;
    }

    try {
      axios.post(
        REVIEW_API_ENDPOINTS.REVIEW,
        {
          orderId: order?.orderId,
          orderDetailNumber: order?.orderDetailNumber,
          rating: star,
          content: content,
        },
        {
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        },
      );
    } catch (error: any) {
      message.error(error?.message);
    }
  };

  return { desc, star, setStar, content, setContent, handleSubmitReview };
};
