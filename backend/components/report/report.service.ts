import { ReportResultState, ReportType } from "@prisma/client";
import prisma from "../../models";
import { NotFoundError } from "../../core/ErrorResponse";

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
	result?: ReportResultState;
	// category?: string;
	sortBy?: 'createdAt';
	order?: 'asc' | 'desc';

	offset?: number;
	limit?: number;
}



type ReportResultData = {
	reportId: number;
	result: ReportResultState;
	reason?: string;
}

class ReportService {
	static async createShopReport(reporterId: number, reportData: ShopReportData) {
		const shop = await prisma.shop.findUnique({
			where: {
				shopOwnerId: reportData.shopId,
			}
		});

		if (!shop)
			throw new NotFoundError('Shop not found');


		const reportReason = await prisma.shopReportReason.findUnique({
			where: {
				categoryName: reportData.reportReason
			}
		});

		if (!reportReason)
			throw new NotFoundError('Report Reason not found');

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
		const product = await prisma.product.findUnique({
			where: {
				productId: reportData.productId
			}
		});
		if (!product)
			throw new NotFoundError('Product not found')

		const reportReason = await prisma.productReportReason.findUnique({
			where: {
				categoryName: reportData.reportReason
			}
		})
		if (!reportReason)
			throw new NotFoundError('Report Reason not found')


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

	static async getReason(type: ReportType) {
		let reasons;

		if (type == ReportType.shop) {
			reasons = await prisma.shopReportReason.findMany();
		}
		else if (type == ReportType.product) {
			reasons = await prisma.productReportReason.findMany();
		}
		else {
			throw new NotFoundError('Invalid report type');
		}

		if (!reasons || reasons.length === 0) {
			throw new NotFoundError('No report reasons found');
		}

		return reasons;
	}
	
	static async getReports(reportQuery: ReportQuery) {
		if (reportQuery.shopId) {
			const shop = await prisma.shop.findUnique({
				where: {
					shopOwnerId: reportQuery.shopId
				}
			});

			if (!shop)
				throw new NotFoundError('Shop not found')
		}

		if (reportQuery.productId) {
			const product = await prisma.product.findUnique({
				where: {
					productId: reportQuery.productId
				}
			});

			if (!product)
				throw new NotFoundError('Product not found')
		}

		if (reportQuery.unprocess)
			return this.getUnprocessReports;

		return await prisma.report.findMany({
			where: {
				shopId: reportQuery.shopId,
				productId: reportQuery.productId,
				createdAt: {
					gte: reportQuery.postedAfter
				},
				type: reportQuery.type,
				reportResult: reportQuery.result ? {
					result: reportQuery.result,
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
			},
			include: {
				reportResult: true,
			}
		});
	}

	static async getUnprocessReports(reportQuery: ReportQuery) {
		if (reportQuery.shopId) {
			const shop = await prisma.shop.findUnique({
				where: {
					shopOwnerId: reportQuery.shopId
				}
			});

			if (!shop)
				throw new NotFoundError('Shop not found')
		}

		if (reportQuery.productId) {
			const product = await prisma.product.findUnique({
				where: {
					productId: reportQuery.productId
				}
			});

			if (!product)
				throw new NotFoundError('Product not found')
		}

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
		});
	}

	static async deleteReport(reportId: number) {
		await prisma.report.delete({
			where: {
				reportId: reportId
			}
		});
	}


	static async createReportResult(handlerId: number, resultdata: ReportResultData) {
		const report = await prisma.report.findUnique({
			where: {
				reportId: resultdata.reportId
			}
		});

		if (!report)
			throw new NotFoundError('Report not found')

		return await prisma.reportResult.create({
			data: {
				reportId: resultdata.reportId,
				handlerId: handlerId,
				result: resultdata.result,
				reason: resultdata.reason
			}
		});
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
