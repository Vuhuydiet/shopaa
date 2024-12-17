import prisma from "../../models";
import OrderService from "../order/order.service";
import UserService from "../user/user.service";


type ReviewData = {
  orderId: number;
  orderDetailNumber: number;
  rating: number;
  content: string;
}

type ReviewQuery = {
  orderId?: number;
  userId?: number;
  shopId?: number;
  productId?: number;
  rating?: number;

  offset?: number;
  limit?: number;
}

class Review {
  static async createReview(userId: number, data: ReviewData) {
    await UserService.checkUserExists(userId);

    await OrderService.checkOrderDetailExists(data.orderId, data.orderDetailNumber);

    return await prisma.review.create({
      data: {
        orderId: data.orderId,
        orderDetailNumber: data.orderDetailNumber,

        rating: data.rating,
        reviewContent: data.content,
      }
    });
  }

  static async getReviewById(reviewId: number) {
    return await prisma.review.findUnique({
      where: { reviewId: reviewId }
    });
  }

  static async getReviews(query: ReviewQuery) {
    return await prisma.$queryRaw`
      SELECT 
        r.*,
        od."productId", 
        o."customerId", 
        o."shopId"
      FROM "Review" r
      JOIN "OrderDetail" od ON od."orderId" = r."orderId" AND od."orderDetailNumber" = r."orderDetailNumber"
      JOIN "Order" o ON o."orderId" = r."orderId"
      WHERE (${query.userId}::INTEGER IS NULL OR o."customerId" = ${query.userId}::INTEGER)
      AND (${query.shopId}::INTEGER IS NULL OR o."shopId" = ${query.shopId}::INTEGER)
      AND (${query.productId}::INTEGER IS NULL OR od."productId" = ${query.productId}::INTEGER)
      AND (${query.orderId}::INTEGER IS NULL OR r."orderId" = ${query.orderId}::INTEGER)
      AND (${query.rating}::INTEGER IS NULL OR r."rating" = ${query.rating}::INTEGER)
      ORDER BY r."createdAt" DESC
      LIMIT ${query.limit ?? 100}::INTEGER
      OFFSET ${query.offset ?? 0}::INTEGER
    `;
  }

  static async deleteReview(reviewId: number) {
    await prisma.review.delete({
      where: { reviewId: reviewId }
    });
  }
}

export default Review;