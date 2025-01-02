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
        AND (${shopId}::INTEGER IS NULL OR o."shopId" = ${shopId}::INTEGER)
        AND o."status" = 'COMPLETED'  
    GROUP BY
        s."shopOwnerId",
        s."shopName",
        EXTRACT(YEAR FROM o."createdAt"),
        EXTRACT(MONTH FROM o."createdAt")
    ORDER BY
        s."shopOwnerId" ASC,
        "year" ASC,
        "month" ASC,
        s."shopName";
  `;
    return revenue;
  }

  // Lấy doanh thu từng sản phẩm theo tháng
  static async getProductRevenueByMonth(query: ProductStatisticsQuery) {
    const { shopId, year } = query;

    const productStats = await prisma.$queryRaw`
      SELECT
          s."shopOwnerId",
          s."shopName",
          p."productName",
          EXTRACT(YEAR FROM o."createdAt") AS "year",
          EXTRACT(MONTH FROM o."createdAt") AS "month",
          SUM(o."totalAmount") AS "totalRevenue" 
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
          AND (${shopId}::INTEGER IS NULL OR o."shopId" = ${shopId}::INTEGER)
      GROUP BY
          s."shopOwnerId",
          s."shopName",
          p."productName",
          EXTRACT(YEAR FROM o."createdAt"),
          EXTRACT(MONTH FROM o."createdAt")
      ORDER BY
           s."shopOwnerId" ASC,
          "year" ASC,
          "month" ASC,
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
          s."shopOwnerId",
          s."shopName",
          o."status" AS "orderStatus",
          EXTRACT(YEAR FROM o."createdAt") AS "year",
          EXTRACT(MONTH FROM o."createdAt") AS "month",
          CAST(COUNT(o."orderId") AS NUMERIC) AS "totalOrders"
      FROM
          "Order" o
      JOIN
          "Shop" s ON o."shopId" = s."shopOwnerId"
      WHERE
          EXTRACT(YEAR FROM o."createdAt") = ${year}
          AND (${shopId}::INTEGER IS NULL OR o."shopId" = ${shopId}::INTEGER)
      GROUP BY
          s."shopOwnerId",
          s."shopName",
          o."status",
          EXTRACT(YEAR FROM o."createdAt"),
          EXTRACT(MONTH FROM o."createdAt")
      ORDER BY
          s."shopOwnerId" ASC,
          "year" ASC,
          "month" ASC,
          s."shopName",
         "orderStatus";
    `;

       // console.log("Executed Query:", orderStats);
    return orderStats;
  }

  // Lấy thống kê số tiền rút theo tháng
  static async getWithdrawalStatistics(query: { year: number; shopId?: number }) {
    const { shopId, year } = query;

    const withdrawalStats = await prisma.$queryRaw`
    SELECT
        s."shopOwnerId",
        s."shopName",
        EXTRACT(YEAR FROM w."createdAt") AS "year",
        EXTRACT(MONTH FROM w."createdAt") AS "month",
        CAST( SUM(w."amount") AS NUMERIC) AS "totalWithdrawalAmount",
        CAST(COUNT(w."requestId") AS NUMERIC) AS "totalRequests"
    FROM
        "WithdrawRequest" w
    JOIN 
        "WithdrawHistory" h ON h."requestId" = w."requestId"
    JOIN
        "Shop" s ON w."shopOwnerId" = s."shopOwnerId"
    WHERE
        EXTRACT(YEAR FROM w."createdAt") = ${year}
        AND (${shopId}::INTEGER IS NULL OR w."shopOwnerId" = ${shopId}::INTEGER)
        AND h."status" = 'ACCEPTED'
    GROUP BY
        s."shopOwnerId",
        s."shopName",
        EXTRACT(YEAR FROM w."createdAt"),
        EXTRACT(MONTH FROM w."createdAt")
    ORDER BY
       s."shopOwnerId" ASC,
        "year" ASC,
        "month" ASC,
        s."shopName";
    `;
    return withdrawalStats;
  }
}

export default StatisticsService;
