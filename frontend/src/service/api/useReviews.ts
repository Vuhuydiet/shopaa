import { useQuery } from 'react-query';
import { IFilterReview } from '../../interfaces/IFilterReview';
import { IReview } from '../../interfaces/IReview';
import { REVIEW_API_ENDPOINTS } from '../../config/API_config';
import axios from 'axios';

export const useReviews = (filter: IFilterReview) => {
  return useQuery({
    queryKey: ['reviews', filter],
    queryFn: () => getReviews(filter),
    // refetchOnMount: false,
    // refetchOnWindowFocus: false,
  });
};

const getReviews = async (filter: IFilterReview): Promise<IReview[]> => {
  try {
    const response = await axios.get(REVIEW_API_ENDPOINTS.REVIEW, {
      params: filter,
    });

    if (response.data?.metadata) {
      const reviews = response.data.metadata?.map((review: any) => {
        return {
          reviewId: review?.reviewId,
          customerName: review?.fullname,
          customerAvatar: review?.customerAvatarUrl,
          rating: review?.rating,
          reviewContent: review?.reviewContent,
          createdAt: review?.createdAt,
          color: review?.color,
          size: review?.size,
        };
      });

      console.log('reviews', reviews);
      return reviews;
    }
  } catch (error: any) {
    throw new Error(error);
  }
  return [];
};
