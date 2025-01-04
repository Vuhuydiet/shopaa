import { Request, Response } from 'express';
import { matchedData } from 'express-validator';
import {
  CreatedResponse,
  OKResponse,
} from '../../core/responses/SuccessResponse';
import WithdrawService from './withdraw.service';
import { Role } from '@prisma/client';
import { UnauthorizedError } from '../../core/responses/ErrorResponse';

export default {
  // Create withdraw request
  createWithdrawRequest: async (req: Request, res: Response) => {
    const { userId } = req.user as any;
    const withdrawData = matchedData(req) as any;
    withdrawData.shopId = userId;
    const withdrawRequest =
      await WithdrawService.createWithdrawRequest(withdrawData);
    new CreatedResponse({
      message: 'Withdraw created successfully',
      metadata: { withdrawRequest },
    }).send(res);
  },

  //create history
  createWithdrawHistory: async (req: Request, res: Response) => {
    const { userId } = req.user as any;
    const data = matchedData(req) as any;
    const history = await WithdrawService.createWithdrawHistory(data, userId);
    new OKResponse({
      message: 'Withdraw history upserted succesfully',
      metadata: history,
    }).send(res);
  },

  //get for shop
  getWithdrawForShop: async (req: Request, res: Response) => {
    const { userId } = req.user as any;
    const requests = await WithdrawService.getWithdrawForShop(userId);
    new OKResponse({
      message: 'Withdraw request for shop fetched succesfully',
      metadata: requests,
    }).send(res);
  },

  //get
  getAllWithdraw: async (req: Request, res: Response) => {
    const query = matchedData(req) as any;
    const requests = await WithdrawService.getAllWithdraw(query);
    new OKResponse({
      message: 'Withdraw request fetched succesfully',
      metadata: requests,
    }).send(res);
  },
  //get by id
  getWithdrawById: async (req: Request, res: Response) => {
    const { userId, role } = req.user as any;
    const { requestId } = matchedData(req);
    const request = await WithdrawService.getWithdrawById(requestId);
    if (role != Role.ADMIN && request.shopOwnerId != userId)
      throw new UnauthorizedError(
        'You are not authorized to view this request',
      );
    new OKResponse({
      message: 'Withdraw request fetched succesfully',
      metadata: { request },
    }).send(res);
  },

  //delete
  deleteWithdrawRequest: async (req: Request, res: Response) => {
    const { requestId } = matchedData(req);
    const deleteWithdrawRequest =
      await WithdrawService.deleteWithdrawRequest(requestId);
    new OKResponse({
      message: 'Withdraw request deleted successfully',
      metadata: deleteWithdrawRequest,
    }).send(res);
  },
};
