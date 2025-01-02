import prisma from "../../models";

type ProductStatisticsQuery = {
  shopId?: number;
  year: number;
};

type OrderStatisticsQuery = {
  shopId?: number;
  year: number;
};

class StatisticsService {
  // Lấy tổng doanh thu theo tháng
  static async getRevenueByMonth(query: ProductStatisticsQuery) {
    const {shopId, year } = query;

    const revenue = await prisma.$queryRaw`
     SELECT
        s."shopOwnerId",
        s."shopName",
        EXTRACT(YEAR FROM o."createdAt") AS "year",
        EXTRACT(MONTH FROM o."createdAt") AS "month",
        SUM(o."totalAmount") AS "totalRevenue"  
    FROM
        "Order" o
    JOIN
        "Shop" s ON o."shopId" = s."shopOwnerId"
    WHERE
        EXTRACT(YEAR FROM o."createdAt") = ${year}
        AND (${query.shopId}::INTEGER IS NULL OR o."shopId" = ${query.shopId}::INTEGER)
        AND o."status" = 'COMPLETED'  
    GROUP BY
        s."shopOwnerId",
        s."shopName",
        EXTRACT(YEAR FROM o."createdAt"),
        EXTRACT(MONTH FROM o."createdAt")
    ORDER BY
        "year" DESC,
        "month" DESC,
        s."shopName";
  `;
    return revenue;
  }

  // Lấy doanh thu từng sản phẩm theo tháng
  static async getProductRevenueByMonth(query: ProductStatisticsQuery) {
    const { shopId, year } = query;

    const productStats = await prisma.$queryRaw`
      SELECT
          s."shopName",
          p."productName",
          EXTRACT(YEAR FROM o."createdAt") AS "year",
          EXTRACT(MONTH FROM o."createdAt") AS "month",
          SUM(od."quantity" * od."price") AS "totalRevenue"
      FROM
          "Order" o
      JOIN
          "OrderDetail" od ON o."orderId" = od."orderId"
      JOIN
          "Shop" s ON o."shopId" = s."shopOwnerId"
      JOIN
          "Product" p ON od."productId" = p."productId"
      WHERE
          EXTRACT(YEAR FROM o."createdAt") = ${year}
          AND (${query.shopId}::INTEGER IS NULL OR o."shopId" = ${query.shopId}::INTEGER)
      GROUP BY
          s."shopName",
          p."productName",
          EXTRACT(YEAR FROM o."createdAt"),
          EXTRACT(MONTH FROM o."createdAt")
      ORDER BY
          "year" DESC,
          "month" DESC,
          s."shopName",
          p."productName";
    `;
    return productStats;
  }

  // Lấy thống kê trạng thái đơn hàng theo tháng
  static async getOrderStatusByMonth(query: OrderStatisticsQuery) {
    const { shopId, year } = query;

    const orderStats = await prisma.$queryRaw`
      SELECT
          s."shopName",
          o."status" AS "orderStatus",
          EXTRACT(YEAR FROM o."createdAt") AS "year",
          EXTRACT(MONTH FROM o."createdAt") AS "month",
          COUNT(o."orderId") AS "totalOrders"
      FROM
          "Order" o
      JOIN
          "Shop" s ON o."shopId" = s."shopOwnerId"
      WHERE
          EXTRACT(YEAR FROM o."createdAt") = ${year}
          { "shopName": string; "orderStatus": string; "year": number; "month": number; "totalOrders": number }[]
      GROUP BY
          s."shopName",
          o."status",
          EXTRACT(YEAR FROM o."createdAt"),
          EXTRACT(MONTH FROM o."createdAt")
      ORDER BY
          "year" DESC,
          "month" DESC,
          s."shopName",
          o."status";
    `;
    return orderStats;
  }

  // Lấy thống kê số tiền rút theo tháng
  static async getWithdrawalStatistics(query: { year: number }) {
    const { year } = query;

    const withdrawalStats = await prisma.$queryRaw`
      SELECT
          EXTRACT(YEAR FROM w."createdAt") AS "year",
          SUM(w."amount") AS "totalWithdrawalAmount"
      FROM
          "Withdrawal" w
      WHERE
          EXTRACT(YEAR FROM w."createdAt") = ${year}
      GROUP BY
          EXTRACT(YEAR FROM w."createdAt")
      ORDER BY
          "Year" DESC;
    `;
    return withdrawalStats;
  }
}

export default StatisticsService;
