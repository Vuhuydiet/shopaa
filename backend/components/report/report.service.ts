import { ReportType } from "@prisma/client";
import prisma from "../../models";

type ShopReportData = {
	reportReason: string;
	description: string;
	shopId: number;

}


type ProductReportData = {
	reportReason: string;
	description: string;
	productId: number;
}

type ReportQuery = {
	shopId?: number;
	productId?: number;
	postedAfter?: Date;
	type?: ReportType;
	// category?: string;
	sortBy?: 'createdAt';
  order?: 'asc' | 'desc';

  offset?: number;
  limit?: number;
}


class ReportService {
	static async createShopReport(reporterId: number, reportData: ShopReportData) {
		return await prisma.report.create({
			data: {
				reporterId: reporterId,
				description: reportData.description,
				type: ReportType.shop,
				shopCategory: reportData.reportReason,
				shopId: reportData.shopId
			}
		});
	}

	static async createProductReport(reporterId: number, reportData: ProductReportData) {
		return await prisma.report.create({
			data: {
				reporterId: reporterId,
				description: reportData.description,
				type: ReportType.product,
				productCategory: reportData.reportReason,
				productId: reportData.productId
			}
		});
	}

	static async getReports(reportQuery: ReportQuery) {
		return await prisma.report.findMany({
			where: { 
				shopId: reportQuery.shopId,
				productId: reportQuery.productId,
				createdAt: {
					gte: reportQuery.postedAfter
				}, 
				type: reportQuery.type,
			},
			orderBy: reportQuery.sortBy ? {
				[reportQuery.sortBy as string]: reportQuery.order
			} : undefined,
			take: reportQuery.limit,
			skip: reportQuery.offset
		});
	}

	static async deleteReport(reportId: number) {
		await prisma.report.delete({
			where: {
				reportId: reportId
			}
		})
	}

}

export default ReportService;