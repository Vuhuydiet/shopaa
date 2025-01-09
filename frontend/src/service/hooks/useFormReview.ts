import { message } from 'antd';
import axios from 'axios';
import { useMemo, useState } from 'react';
import { REVIEW_API_ENDPOINTS } from '../../config/API_config';
import { IProductOrder } from '../../interfaces/Order/IProductOrder';

export const useFormReview = (
  order: IProductOrder,
  setOrderProduct: (a: IProductOrder | null) => void,
) => {
  const desc = useMemo(
    () => ['Very bad', 'Bad', 'Normal', 'Good', 'Very good'],
    [],
  );

  const [star, setStar] = useState(0);
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReview = () => {
    if (star === 0) {
      message.error('Please rate the product');
      return;
    }

    if (content === '') {
      message.error('Please write a review');
      return;
    }

    if (content.length > 1000) {
      message.error(
        'Content exceeds the 1000 character limit! Please summarize.',
      );
      return;
    }

    setIsSubmitting(true);

    try {
      console.log({
        orderId: order?.orderId,
        orderDetailNumber: order?.orderDetailNumber,
        rating: star,
        content: content,
      });

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
      message.success('Review submitted successfully!');
      console.log('order id:', order.orderId);
      setOrderProduct(null);
      setIsSubmitting(false);
    } catch (error: any) {
      message.error(error?.message);
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    desc,
    star,
    setStar,
    content,
    setContent,
    handleSubmitReview,
  };
};
