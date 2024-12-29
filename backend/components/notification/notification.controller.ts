import { Request, Response } from "express";
import { matchedData } from 'express-validator';
import NotificationService from "./services/notification.service";
import { OKResponse } from "../../core/responses/SuccessResponse";


export default {
  getNotifications: async (req: Request, res: Response) => {
    const { userId } = req.user as any;
    const query = matchedData(req) as any;
    const { count, notifications } = await NotificationService.getNotifications(userId, query);
    new OKResponse({ message: 'Get notifications successfully', metadata: { count, notifications } }).send(res);
  },

}