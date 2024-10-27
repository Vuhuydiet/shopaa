import { Request, Response } from "express";
import UserService from "../services/user.service";
import { OKResponse } from "../core/SuccessResponse";

export default {

  getUserProfile: async (req: Request, res: Response) => {
    const { userId } = req.params;
    const profile = await UserService.getUserProfile(+userId);
    new OKResponse({ message: 'Get profile successfully', metadata: { profile } }).send(res);
  },

  updateUserProfile: async (req: Request, res: Response) => {
    const { userId } = req.user as any;
    const { profile } = req.body;
    await UserService.updateUserProfile(userId, profile);
    new OKResponse({ message: 'User profile update successfully' }).send(res);
  },

  updatePassword: async (req: Request, res: Response) => {
    const { userId } = req.user as any;
    const { newPassword } = req.body;
    await UserService.updateUserAccountPassword(userId, newPassword);
    new OKResponse({ message: 'Password updated successfully' }).send(res);
  },

  deleteUser: async (req: Request, res: Response) => {
    const { userId } = req.user as any;
    await UserService.deleteUser(userId);
    new OKResponse({ message: 'User deleted successfully' }).send(res);
  },

}