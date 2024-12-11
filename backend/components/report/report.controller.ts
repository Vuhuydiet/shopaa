import { Request, Response } from "express";
import { matchedData } from "express-validator";
import ReportService from "./report.service";
import { CreatedResponse, OKResponse } from "../../core/SuccessResponse";


export default {
  // create shop report
  createShopReport: async (req: Request, res: Response) => {
    const { userId } = req.user as any;
    const reportData = matchedData(req) as any;
    const report = await ReportService.createShopReport(userId, reportData);
    new CreatedResponse({ message: "Shop Report created successfully", metadata: { report } }).send(res);

  },

  //create product report
  createProductReport: async (req: Request, res: Response) => {
    const { userId } = req.user as any;
    const reportData = matchedData(req) as any;
    const report = await ReportService.createProductReport(userId, reportData);
    new CreatedResponse({ message: "Product Report created sucessfully", metadata: { report } }).send(res);
  },

  // get list reports
  getReports: async (req: Request, res: Response) => {
    const reportQuery = matchedData(req) as any;
    const reports = await ReportService.getReports(reportQuery);
    new OKResponse({ message: "Reports displayed sucessfully", metadata: { reports } }).send(res);
  },

  // get report by Id
  getReportById: async (req: Request, res: Response) => {
    const { reportId } = matchedData(req);
    const report = await ReportService.getReportbyId(reportId);
    new OKResponse({ message: "Report displayed sucessfully", metadata: { report } }).send(res);
  },

  //delete report
  deleteReport: async (req: Request, res: Response) => {
    const { reportId } = matchedData(req);
    await ReportService.deleteReport(reportId);
    new OKResponse({ message: "Report deleted sucessfully" }).send(res);
  },

  //create Report Result
  createReportResult: async (req: Request, res: Response) => {
    const { userId } = req.user as any;
    const resultdata = matchedData(req) as any;
    const result = await ReportService.createReportResult(userId, resultdata);
    new CreatedResponse({ message: "Report Result created sucessfully", metadata: { result } }).send(res);
  },


  //delete reportresult
  deleteReportResult: async (req: Request, res: Response) => {
    const { reportId } = matchedData(req);
    await ReportService.deleteReportResult(reportId);
    new OKResponse({ message: "Report Result deleted sucessfully" }).send(res);
  },
};