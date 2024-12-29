import { OrderStatus } from '@prisma/client';
import { BadRequestError, NotFoundError } from '../../core/responses/ErrorResponse';
import prisma from '../../models';
import OrderService from '../order/order.service';

type ReviewData = {
  orderId: number;
  orderDetailNumber: number;
  rating: number;
  content: string;
};

type ReviewQuery = {
  orderId?: number;
  userId?: number;
  shopId?: number;
  productId?: number;
  rating?: number;

  offset?: number;
  limit?: number;
};

class ReviewService {
  static async createReview(userId: number, data: ReviewData) {
    await OrderService.checkOrderDetailExists(
      data.orderId,
      data.orderDetailNumber,
    );

    const order = await OrderService.getOrderById(data.orderId);
    if (order.status != OrderStatus.COMPLETED)
      throw new BadRequestError('Order is not completed yet to be reviewed');

    if (order.customerId != userId) {
      throw new BadRequestError('You are not allowed to review this order because you are not the owner');
    }

    return await prisma.review.create({
      data: {
        orderId: data.orderId,
        orderDetailNumber: data.orderDetailNumber,

        rating: data.rating,
        reviewContent: data.content,
      },
    });
  }

  static async getReviewById(reviewId: number) {
    const review = await prisma.review.findUnique({
      where: { reviewId: reviewId },
      include: {
        orderDetail: true,
        order: {
          include: {
            shop: {
              select: { shopOwnerId: true },
            },
            customer: {
              include: {
                avatarImage: {
                  select: { url: true },
                },
              },
            },
          },
        },
      },
    });
    if (!review) 
      throw new NotFoundError('Review not found');
    let reviewData: any = review;
    let customer: any = review?.order.customer;
    customer.avatar = customer.avatarImage?.url;
    delete customer.avatarImage;
    reviewData.customer = review?.order.customer;
    delete reviewData.order;
    return reviewData;
  }

  static async getReviews(query: ReviewQuery) {
    const count = await prisma.review.count({
      where: {
        order:
          query.shopId || query.userId
            ? {
                customerId: query.userId,
                shopId: query.shopId,
              }
            : undefined,
        orderDetail: query.productId
          ? {
              productId: query.productId,
            }
          : undefined,
        orderId: query.orderId,
        rating: query.rating,
      },
    });
    const reviews = await prisma.$queryRaw`
      SELECT 
        r.*,
        od.*,
        u."userId" as "customerId",
        u."fullname",
        i."url" as "customerAvatarUrl",
        o."shopId"
      FROM "Review" r
      JOIN "OrderDetail" od ON od."orderId" = r."orderId" AND od."orderDetailNumber" = r."orderDetailNumber"
      JOIN "Order" o ON o."orderId" = r."orderId"
      JOIN "UserProfile" u ON u."userId" = o."customerId"
      LEFT JOIN "Image" i ON i."imageId" = u."avatarImageId"
      WHERE (${query.userId}::INTEGER IS NULL OR o."customerId" = ${query.userId}::INTEGER)
      AND (${query.shopId}::INTEGER IS NULL OR o."shopId" = ${query.shopId}::INTEGER)
      AND (${query.productId}::INTEGER IS NULL OR od."productId" = ${query.productId}::INTEGER)
      AND (${query.orderId}::INTEGER IS NULL OR r."orderId" = ${query.orderId}::INTEGER)
      AND (${query.rating}::INTEGER IS NULL OR r."rating" = ${query.rating}::INTEGER)
      ORDER BY r."createdAt" DESC
      LIMIT ${query.limit ?? 100}::INTEGER
      OFFSET ${query.offset ?? 0}::INTEGER
    `;
    return { count, reviews };
  }

  static async deleteReview(reviewId: number) {
    await prisma.review.delete({
      where: { reviewId: reviewId },
    });
  }
}

export default ReviewService;
