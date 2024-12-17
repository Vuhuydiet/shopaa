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
    return await prisma.$queryRawUnsafe(`
      SELECT 
        r.*,
        od."productId", 
        o."customerId", 
        o."shopId"
      FROM "Review" r
      JOIN "OrderDetail" od ON od."orderId" = r."orderId" AND od."orderDetailNumber" = r."orderDetailNumber"
      JOIN "Order" o ON o."orderId" = r."orderId"
      WHERE ($1 IS NULL OR o."customerId" = $1)
      AND ($2 IS NULL OR o."shopId" = $2)
      AND ($3 IS NULL OR od."productId" = $3)
      AND ($4 IS NULL OR r."orderId" = $4)
      AND ($5 IS NULL OR r."rating" = $5)
      ORDER BY r."createdAt" DESC
      LIMIT $6
      OFFSET $7
    `, [query.userId, query.shopId, query.productId, query.orderId, query.rating, query.limit ?? 100, query.offset ?? 0]);

    // return await prisma.$queryRaw`
    //   SELECT 
    //     r.*,
    //     od."productId", 
    //     o."customerId", 
    //     o."shopId"
    //   FROM "Review" r
    //   JOIN "OrderDetail" od ON od."orderId" = r."orderId" AND od."orderDetailNumber" = r."orderDetailNumber"
    //   JOIN "Order" o ON o."orderId" = r."orderId"
    //   WHERE (${query.userId} IS NULL OR o."customerId" = ${query.userId})
    //   AND (${query.shopId} IS NULL OR o."shopId" = ${query.shopId})
    //   AND (${query.productId} IS NULL OR od."productId" = ${query.productId})
    //   AND (${query.orderId} IS NULL OR r."orderId" = ${query.orderId})
    //   AND (${query.rating} IS NULL OR r."rating" = ${query.rating})
    //   ORDER BY r."createdAt" DESC
    //   LIMIT ${query.limit ?? 100}
    //   OFFSET ${query.offset ?? 0}
    // `;
  }

  static async deleteReview(reviewId: number) {
    await prisma.review.delete({
      where: { reviewId: reviewId }
    });
  }
}

export default Review;