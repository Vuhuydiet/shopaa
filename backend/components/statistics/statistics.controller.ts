import { Request, Response } from "express";
import { matchedData } from "express-validator";
import StatisticsService from "./statistics.service";
import { OKResponse } from "../../core/SuccessResponse";
import { Role } from "@prisma/client";
import { UnauthorizedError } from "../../core/ErrorResponse";

export default {
  // Lấy tổng doanh thu theo tháng
  getRevenueByMonth: async (req: Request, res: Response) => {
    const { role, userId } = req.user as any;
    const query = matchedData(req) as { shopId?: number; year: number };

    // Kiểm tra quyền hạn
    if (role !== Role.ADMIN && query.shopId !== userId) {
      throw new UnauthorizedError("You are not authorized to view this request");
    }
    const revenue = await StatisticsService.getRevenueByMonth(query);

    new OKResponse({
      message: "Monthly revenue fetched successfully",
      metadata: { revenue },
    }).send(res);
  },

  // Lấy doanh thu từng sản phẩm theo tháng
  getProductRevenueByMonth: async (req: Request, res: Response) => {
    const { role, userId } = req.user as any;
    const query = matchedData(req) as { shopId?: number; year: number };

    // Kiểm tra quyền hạn
    if (role !== Role.ADMIN && query.shopId !== userId) {
      throw new UnauthorizedError("You are not authorized to view this request");
    }
    
    if (role === Role.ADMIN) {
      query.shopId = undefined; 
    }

    // Lấy thống kê doanh thu theo sản phẩm từ service
    const productStats = await StatisticsService.getProductRevenueByMonth(query);

    new OKResponse({
      message: "Product revenue statistics fetched successfully",
      metadata: { productStats },
    }).send(res);
  },

  // Lấy thống kê trạng thái đơn hàng theo tháng
  getOrderStatusByMonth: async (req: Request, res: Response) => {
    const { role, userId } = req.user as any;
    const query = matchedData(req) as { shopId?: number; year: number };

    // Kiểm tra quyền hạn
    if (role !== Role.ADMIN && query.shopId !== userId) {
      throw new UnauthorizedError("You are not authorized to view this request");
    }
    
    if (role === Role.ADMIN) {
      query.shopId = undefined; 
    }

    // Lấy thống kê trạng thái đơn hàng theo tháng từ service
    const orderStats = await StatisticsService.getOrderStatusByMonth(query);

    new OKResponse({
      message: "Order status statistics fetched successfully",
      metadata: { orderStats },
    }).send(res);
  },

  // Lấy thống kê số tiền rút theo tháng
  getWithdrawalStatistics: async (req: Request, res: Response) => {
    const { role } = req.user as any;

    // Kiểm tra quyền hạn của admin
    if (role !== Role.ADMIN) {
      throw new UnauthorizedError("You are not authorized to view withdrawal statistics");
    }

    const query = matchedData(req) as { year: number };

    // Lấy thống kê tiền rút từ service
    const withdrawalStats = await StatisticsService.getWithdrawalStatistics(query);

    new OKResponse({
      message: "Withdrawal statistics fetched successfully",
      metadata: { withdrawalStats },
    }).send(res);
  },
};
