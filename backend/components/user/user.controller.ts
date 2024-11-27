import { Request, Response } from "express";
import UserService from "./user.service";
import { OKResponse } from "../../core/SuccessResponse";
import { matchedData } from "express-validator";

export default {

  getUserProfile: async (req: Request, res: Response) => {
    const { userId } = matchedData(req);
    
    const profile = await UserService.getUserProfile(+userId, req.user && +userId == (req.user as any).userId);
    
    new OKResponse({ message: 'Get profile successfully', metadata: { profile } }).send(res);
  },

  updateUserProfile: async (req: Request, res: Response) => {
    const { userId } = req.user as any;
    const profile = req.body.profile;
    profile.avatar = req.file as Express.Multer.File;
    const newProfile = await UserService.updateUserProfile(userId, profile);
    
    new OKResponse({ message: 'User profile update successfully', metadata: { profile: newProfile } }).send(res);
  },

  deleteUser: async (req: Request, res: Response) => {
    const { userId } = req.user as any;
    
    await UserService.deleteUser(userId);
    
    new OKResponse({ message: 'User deleted successfully' }).send(res);
  },

}