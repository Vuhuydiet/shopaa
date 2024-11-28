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
	reportResult?: ReportResultState;
	// category?: string;
	sortBy?: 'createdAt';
  order?: 'asc' | 'desc';

  offset?: number;
  limit?: number;
}



type ReportResult = {
		result: string;
		handlerId: number

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
				reportResult: reportQuery.reportResult
			},
			orderBy: reportQuery.sortBy ? {
				[reportQuery.sortBy as string]: reportQuery.order
			} : undefined,
			take: reportQuery.limit,
			skip: reportQuery.offset,

			include: {
				reportResult: true,
				shopReportReason: true,
				productReportReason: true,
			}
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


class ReportResultService {
	static async createReportResult(reportId: number ,resultdata : ReportResult ) {
		return await prisma.reportResult.create({
			data:{
				reportId: reportId,
				result: resultdata.result,
				handlerId: resultdata.handlerId
			}
		});
	}

	static async getReportResult(reporterId: number, resultdata: ReportResult) {
		return await prisma.reportResult.findMany({
			where : {
				reportId: reporterId,
				result: resultdata.result
			}
		});
	}


	static async deleteReportResult(reportId: number) {
		await prisma.reportResult.delete({
			where : {
				reportId : reportId
			}
		})
	} 
	
}


export default ReportService;
export default ReportResultService;