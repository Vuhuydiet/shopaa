import { useQuery } from 'react-query';
import { IFilterReview } from '../../interfaces/IFilterReview';
import { IReview } from '../../interfaces/IReview';
import { REVIEW_API_ENDPOINTS } from '../../config/API_config';
import axios from 'axios';
import { useMemo, useState } from 'react';
import { IProduct } from '../../interfaces/IProduct';
import { REVIEWS_FILTER } from '../../config/constants';

export const useReviews = (product: IProduct) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [filter, setFilter] = useState<IFilterReview>({
    limit: REVIEWS_FILTER.ITEMS_PER_PAGE,
    sortBy: 'createdAt',
    order: 'desc',
    productId: product.id,
  });

  const handleRateFilterChange = (value: number | undefined) => {
    console.log(value);

    setFilter((prev) => ({
      ...prev,
      rating: value,
    }));
  };

  const onPageChange = (page: any) => {
    setCurrentPage(page);

    setFilter((prev) => ({
      ...prev,
      offset: (page - 1) * REVIEWS_FILTER.ITEMS_PER_PAGE,
    }));
  };

  const averageRate = useMemo((): number => {
    return product.numReviews
      ? Number((product.totalRating / product.numReviews).toFixed(1))
      : 0;
  }, [product]);

  return {
    averageRate,
    currentPage,
    filter,
    onPageChange,
    handleRateFilterChange,
    query: useQuery({
      queryKey: ['reviews', filter],
      queryFn: () => getReviews(filter),
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }),
  };
};

const getReviews = async (
  filter: IFilterReview,
): Promise<{
  reviews: IReview[];
  count: number;
}> => {
  try {
    const response = await axios.get(REVIEW_API_ENDPOINTS.REVIEW, {
      params: filter,
    });

    console.log(response.data);
    if (response.data?.metadata?.reviews) {
      const reviews = response.data?.metadata?.reviews?.map((review: any) => {
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
      return {
        reviews: reviews,
        count: response.data?.metadata?.count || 0,
      };
    }
  } catch (error: any) {
    throw new Error(error);
  }
  return {
    reviews: [],
    count: 0,
  };
};
