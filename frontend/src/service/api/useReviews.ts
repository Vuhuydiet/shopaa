import { useQuery } from 'react-query';
import { IFilterReview } from '../../interfaces/IFilterReview';
import { IReview } from '../../interfaces/IReview';
import {
  REVIEW_API_ENDPOINTS,
  USER_API_ENDPOINTS,
} from '../../config/API_config';
import axios from 'axios';

export const useReviews = (
  filter: IFilterReview = { limit: 5, sortBy: 'createdAt', order: 'desc' },
) => {
  return useQuery({
    queryKey: ['reviews', filter],
    queryFn: () => getReviews(filter),
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

const getReviews = async (filter: IFilterReview): Promise<IReview[]> => {
  try {
    const response = await axios.get(REVIEW_API_ENDPOINTS.REVIEW, {
      data: filter,
    });

    if (response.data?.metadata) {
      const reviews = await Promise.all(
        response.data.metadata?.map(async (review: any) => {
          const customer = await axios.get(
            `${USER_API_ENDPOINTS.USER_PROFILE}${review?.customerId}`,
          );

          return {
            reviewId: review?.reviewId,
            customerName: customer?.data?.metadata?.profile?.fullName,
            customerAvater: customer?.data?.metadata?.profile?.avatarImage?.url,
            rating: review?.rating,
            reviewContent: review?.reviewContent,
            createdAt: review?.createdAt,
          };
        }),
      );
    }
  } catch (error: any) {
    throw new Error(error);
  }
  return [];
};
