import { Request, Response } from "express";
import { matchedData } from "express-validator";
import { CreatedResponse, OKResponse } from "../../core/SuccessResponse";
import WithdrawService from "./withdraw.service";

export default {
  // Create withdraw request
  createWithdrawRequest: async (req: Request, res: Response) => {
    const withdrawData = matchedData(req) as any;
    const withdrawRequest = await WithdrawService.createWithdrawRequest(withdrawData);
    new CreatedResponse({message: "Withdraw created successfully",metadata: { withdrawRequest }}).send(res);
  },

  //get
  getAllWithdraw: async(req:Request, res:Response) => {
    const query = matchedData(req) as any;
    const withdrawRequest =await WithdrawService.getAllWithdraw(query);
    new OKResponse({message: "Withdraw request fetched succesfully", metadata: withdrawRequest}).send(res);
  },
  //get by id
  getWithdrawById: async(req: Request,res: Response) => {
    const {requestId} = matchedData(req);
    const withdrawRequest = await WithdrawService.getWithdrawById(requestId);
    new OKResponse({message:"Withdraw request fetched succesfully", metadata: {withdrawRequest}}).send(res);
  },

  //get for shop
  getWithdrawForShop: async(req:Request, res:Response) =>{
    const data= matchedData(req) as any;
    const withdrawRequest= await WithdrawService.getWithdrawForShop(data);
    new OKResponse({message:"Withdraw request for shop fetched succesfully", metadata:withdrawRequest}).send(res);
  },

  //upsert history
  createWithdrawHistory: async(req:Request, res:Response) => {
    const {userId} = req.user as any;
    const data = matchedData(req) as any;
    const history = await WithdrawService.createWithdrawHistory(data,userId);
    new OKResponse({message:"Withdraw history upserted succesfully", metadata: history}).send(res);
  },

  //delete
  deleteWithdrawRequest: async(req: Request,res:Response)=>{
    const { requestId} =matchedData(req);
    const deleteWithdrawRequest = await WithdrawService.deleteWithdrawRequest(requestId);
    new OKResponse({message: "Withdraw request deleted successfully",metadata:deleteWithdrawRequest}).send(res);
  },
};
