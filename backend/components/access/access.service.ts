import { BadRequestError, InternalServerError, NotFoundError } from "../../core/responses/ErrorResponse";
import prisma from "../../models";
import { getHashedPassword, comparePassword } from "../../libraries/utils/password";
import JWT from "./auth/JWT";
import UserService from "../user/user.service";
import OTPService from "./otp.service";
import { Role } from "@prisma/client";

class AccessService {

  static async signUp(username: string, password: string, email: string) {
    let user = await prisma.userAccount.findUnique({
      where: { username }
    });
    if (user) {
      throw new BadRequestError('User already exists');
    }
    user = await prisma.userAccount.findUnique({
      where: { email }
    });
    if (user) {
      throw new BadRequestError('Email has already been reegistered');
    }

    const newUser = await UserService.createUserAccount(username, getHashedPassword(password), email);
    if (!newUser) {
      throw new InternalServerError('User creation failed');
    }
  }

  static async signIn(username: string, password: string) {
    const user = await prisma.userAccount.findUnique({
      where: { username: username },
      select: {
        userId: true,
        password: true,
        profile: {
          select: {
            role: true
          }
        }
      }
    });

    if (!user) {
      throw new BadRequestError('User does not exist');
    }

    if (!comparePassword(password, user.password)) {
      throw new BadRequestError('Invalid password');
    }

    const token = JWT.generateToken(user.userId);
    return { token, isAdmin: user.profile.role === Role.ADMIN };
  }

  static async getUserAccount(userId: number) {
    const user = await prisma.userAccount.findUnique({
      where: { userId },
      select: {
        username: true,
        email: true,
      }
    });

    if (!user) {
      throw new NotFoundError('User not found');
    }

    return user;
  }

  static async changePassword(userId: number, oldPassword: string, newPassword: string) {
  const user = await prisma.userAccount.findUnique({
      where: { userId: userId }
    });

    if (!user) {
      throw new BadRequestError('User does not exist');
    }

    if (!oldPassword || !comparePassword(oldPassword, user.password)) {
      throw new BadRequestError('Invalid old password');
    }

    await prisma.userAccount.update({
      where: { userId },
      data: { password: getHashedPassword(newPassword) }
    });
  }

  static async forgotPassword(email: string, otp: number, newPassword: string) {
    const user = await prisma.userAccount.findUnique({
      where: { email }
    });

    if (!user) {
      throw new BadRequestError('User does not exist');
    }

    if (!OTPService.validateOtp(email, otp)) {
      throw new BadRequestError('Invalid OTP');
    }

    await prisma.userAccount.update({
      where: { email },
      data: { password: getHashedPassword(newPassword) }
    });
  }

  static async signInWithOAuth(userId: number) {
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
      select: { role: true }
    });
    if (!profile) {
      throw new NotFoundError('User not found');
    }

    return JWT.generateToken(userId);
  }
}

export default AccessService;