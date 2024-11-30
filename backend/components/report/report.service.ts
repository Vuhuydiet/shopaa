import { ReportResultState, ReportType } from "@prisma/client";
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
	unprocess?: boolean;
	shopId?: number;
	productId?: number;
	postedAfter?: Date;
	postedBefore?: Date;
	type?: ReportType;
	reportResult?: ReportResultState;
	// category?: string;
	sortBy?: 'createdAt';
	order?: 'asc' | 'desc';

	offset?: number;
	limit?: number;
}



type ReportResultData = {
	reportId: number;
	result: ReportResultState;

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
		if(reportQuery.unprocess) 
			return this.getUnprocessReports;

		return await prisma.report.findMany({
			where: {
				shopId: reportQuery.shopId,
				productId: reportQuery.productId,
				createdAt: {
					gte: reportQuery.postedAfter
				},
				type: reportQuery.type,
				reportResult: reportQuery.reportResult ? {
					result: reportQuery.reportResult,
				} : undefined

			},
			orderBy: reportQuery.sortBy ? {
				[reportQuery.sortBy as string]: reportQuery.order
			} : undefined,
			take: reportQuery.limit,
			skip: reportQuery.offset,

			include: {
				reportResult: true,
			}

		});
	}

	static async getReportbyId(reportId: number) {
		return await prisma.report.findUnique({
			where: {
				reportId: reportId
			}
		});
	}

	static async getUnprocessReports(reportQuery: ReportQuery) {
		return await prisma.report.findMany({
			where: {
				shopId: reportQuery.shopId,
				productId: reportQuery.productId,
				createdAt: {
					gte: reportQuery.postedAfter,
					lte: reportQuery.postedBefore
				},
				type: reportQuery.type,
				reportResult: null
			},
			orderBy: reportQuery.sortBy ? {
				[reportQuery.sortBy as string]: reportQuery.order
			} : undefined,
			take: reportQuery.limit,
			skip: reportQuery.offset,
		})
	}

	static async deleteReport(reportId: number) {
		await prisma.report.delete({
			where: {
				reportId: reportId
			}
		});
	}


	static async createReportResult(handlerId: number, resultdata: ReportResultData) {
		return await prisma.reportResult.create({
			data: {
				reportId: resultdata.reportId,
				result: resultdata.result,
				handlerId: handlerId
			}
		});
	}

	static async getReportResultById(reportId: number) {
		return await prisma.reportResult.findUnique({
			where: {
				reportId: reportId,
			}
		});
	}

	static async getReportResultsByState(result: ReportResultState) {
		return await prisma.reportResult.findMany({
			where: {
				result: result,
			}
		})
	}


	static async deleteReportResult(reportId: number) {
		await prisma.reportResult.delete({
			where: {
				reportId: reportId
			}
		})
	}

}


export default ReportService;
