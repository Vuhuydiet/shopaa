import { Request, Response } from "express";
import { CreatedResponse, OKResponse } from "../../core/SuccessResponse";
import AccessService from "./access.service";
import EmailService from "../email/email.service";
import { BadRequestError } from "../../core/ErrorResponse";
import { matchedData } from "express-validator";
import JWT from "../../libraries/auth/JWT";

export default {

  sendOtp: async (req: Request, res: Response) => {
    const { email } = matchedData(req);

    await EmailService.sendOtpEmail(email);

    new OKResponse({
      message: 'OTP sent successfully',
    }).send(res);
  },

  signUp: async (req: Request, res: Response) => {
    const { username, password, email, otp } = matchedData(req);

    if (!EmailService.validateOtp(email, otp))
      throw new BadRequestError('Invalid OTP');

    await AccessService.signUp(username, password, email);
    new CreatedResponse({
      message: 'User created successfully'
    }).send(res);
  },

  signIn: async (req: Request, res: Response) => {
    const { username, password } = matchedData(req);

    const token = await AccessService.signIn(username, password);
    new OKResponse({
      message: 'User signed in successfully',
      metadata: { token }
    }).send(res);
  },

  getAccount: async (req: Request, res: Response) => {
    const { userId } = req.user as any;
    const user = await AccessService.getUserAccount(userId);
    new OKResponse({
      message: 'User details fetched successfully',
      metadata: { user }
    }).send(res);
  },

  changePassword: async (req: Request, res: Response) => {
    const { userId } = req.user as any;
    const { oldPassword, newPassword } = matchedData(req);

    await AccessService.changePassword(userId, oldPassword, newPassword);
    new OKResponse({
      message: 'Password changed successfully'
    }).send(res);
  },

  forgotPassword: async (req: Request, res: Response) => {
    const { email, otp, newPassword } = matchedData(req);

    await AccessService.forgotPassword(email, otp, newPassword);

    new OKResponse({
      message: 'Forgot password email sent successfully'
    }).send(res);
  },

  signInWithOAuth: async (req: Request, res: Response) => {
    const { userId } = req.user as any;
    const token = JWT.generateToken(userId);
    new CreatedResponse({
      message: 'User signed in successfully',
      metadata: { token }
    }).send(res);
  },

}