import { Request, Response } from "express";
import { CreatedResponse, OKResponse } from "../core/SuccessResponse";
import accessService from "../services/access.service";
import EmailService from "../services/email.service";
import { BadRequestError } from "../core/ErrorResponse";
import UserService from "../services/user.service";
import { invalidatePassword } from "../utils/cryptoUtils";
import { matchedData } from "express-validator";
import TokenService from "../services/token.service";

export default {

  sendOtp: async (req: Request, res: Response) => {
    const { email } = matchedData(req);
    if (await UserService.checkUserAccountExists({ email: email }))
      throw new BadRequestError('Email has already been registered');

    await EmailService.sendOtpEmail(email);

    new OKResponse({
      message: 'OTP sent successfully',
    }).send(res);
  },

  signUp: async (req: Request, res: Response) => {
    const { username, password, email, otp } = matchedData(req);

    if (!EmailService.validateOtp(email, otp))
      throw new BadRequestError('Invalid OTP');

    await accessService.signUp(username, password, email);
    new CreatedResponse({
      message: 'User created successfully'
    }).send(res);
  },

  signIn: async (req: Request, res: Response) => {
    const { username, password } = matchedData(req);

    const token = await accessService.signIn(username, password);
    new OKResponse({
      message: 'User signed in successfully',
      metadata: { token }
    }).send(res);
  },

  changePassword: async (req: Request, res: Response) => {
    const { userId } = req.user as any;
    const userAccount = await UserService.getUserAccount(userId);
    if (!userAccount)
      throw new BadRequestError('Account does not exist');

    const { otp, oldPassword, newPassword } = matchedData(req);
    if (!EmailService.validateOtp(userAccount.email, otp) && (!oldPassword || !invalidatePassword(oldPassword, userAccount.password)))
      throw new BadRequestError(`Invalid OTP and old password`);

    await accessService.changePassword(userId, newPassword);

    new OKResponse({
      message: 'Password changed successfully'
    }).send(res);
  },

  signInWithOAuth: async (req: Request, res: Response) => {
    const { userId } = req.user as any;
    const token = TokenService.generateToken(userId);
    new CreatedResponse({
      message: 'User signed in successfully',
      metadata: { token }
    }).send(res);
  },

}