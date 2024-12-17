import { Request, Response } from "express";
import { matchedData } from "express-validator";
import ReturnService from "./return.service";
import { CreatedResponse, OKResponse } from "../../core/SuccessResponse";

export default {
  // Create  return
  createReturnSlip: async (req: Request, res: Response) => {
    const returnData = matchedData(req) as any;
    const returnSlip = await ReturnService.createReturnSlip(returnData);
    new CreatedResponse({ message: "Missing or Unreceived Return Slip created successfully", metadata: { returnSlip } }).send(res);
  },

  getReturnSlips: async (req: Request, res: Response) => {
    const query = matchedData(req) as any;
    const returnSlips = await ReturnService.getReturnSlips(query);
    new OKResponse({ message: "Return Slips fetched successfully", metadata: { returnSlips } }).send(res);
  },

  // Get return slip by ID
  getReturnSlipById: async (req: Request, res: Response) => {
    const { returnId } = matchedData(req);
    const returnSlip = await ReturnService.getReturnSlipById(returnId);
    new OKResponse({ message: "Return Slip fetched successfully", metadata: { returnSlip } }).send(res);
  },

  // Update return slip
  updateReturnSlip: async (req: Request, res: Response) => {
    const { returnId } = matchedData(req);
    const updateData = matchedData(req) as any;
    const updatedReturnSlip = await ReturnService.updateReturnSlip(returnId, updateData);
    new OKResponse({ message: "Return Slip updated successfully", metadata: { updatedReturnSlip } }).send(res);
  },

  // Delete return slip
  deleteReturnSlip: async (req: Request, res: Response) => {
    const { returnId } = matchedData(req);
    await ReturnService.deleteReturnSlip(returnId);
    new OKResponse({ message: "Return Slip deleted successfully" }).send(res);
  },
};
