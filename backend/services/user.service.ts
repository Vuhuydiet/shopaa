 import { UserProfile } from "@prisma/client";
import prisma from "../prisma";
import { BadRequestError, NotFoundError } from "../core/ErrorResponse";
import { getHashedPassword } from "../utils/cryptoUtils";

class UserService {
  static async createOAuthProviderIfNotExists(providerName: string, providerUID: string, userFullname: string) {
    return await prisma.$transaction(async (tx) => {
      const userId = await tx.oAuthProvider.findUnique({
        where: { 
          providerName_providerUID: { 
            providerName: providerName, 
            providerUID: providerUID 
          }
        },
        select: {
          userId: true
        }
      });

      if (userId)
        return userId;
      
      const userProfile = await tx.userProfile.create({
        data: {
          fullname: userFullname,
        },
      })
      return await tx.oAuthProvider.create({
        data: {
          providerUID: providerUID,
          providerName: providerName,
          profile: {
            connect: {
              userId: userProfile.userId,
            }
          }
        },
        select: { userId: true }
      });
    });
  }

  static async createUserAccount(username: string, password: string) {
    return await prisma.$transaction(async (tx) => {
      const userProfile = await tx.userProfile.create({});
      return await tx.userAccount.create({
        data: {
          username,
          password,
          profile: {
            connect: {
              userId: userProfile.userId,
            }
          }
        },
        select: { userId: true }
      });
    })
  }

  static async getUserProfile(userId: number) {
    const profile = await prisma.userProfile.findUnique({
      where: { userId: userId }
    });
    if (!profile)
      throw new NotFoundError(`User profile for userId: '${userId} does not exist`)

    return profile;
  }

  static async updateUserProfile(userId: number, newProfile: Partial<UserProfile>) {
    try {
      await prisma.userProfile.update({
        where: { userId: userId },
        data: newProfile,
      });
    }
    catch (err) {
      throw new BadRequestError(`Failed to update user profile for userId: '${userId}'`);
    }
  }

  static async updateUserAccountPassword(userId: number, newPassword: string) {
    try {
      await prisma.userAccount.update({
        where: { userId: userId },
        data: { password: getHashedPassword(newPassword) },
        select: { userId: true }
      })
    }
    catch (err) {
      throw new BadRequestError(`Failed to update password for userId: '${userId}'`);
    }
  }

  static async deleteUser(userId: number) {
    try {
      await prisma.userProfile.delete({
        where: { userId: userId }
      });
    }
    catch (err) {
      throw new BadRequestError(`Failed to delete user profile for userId: '${userId}'`);
    }
  }

}

export default UserService;
