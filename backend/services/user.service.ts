import { UserProfile } from "@prisma/client";
import prisma from "../prisma";
import { BadRequestError, NotFoundError } from "../core/ErrorResponse";

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

  static async createUserAccount(username: string, password: string, email: string) {
    return await prisma.$transaction(async (tx) => {
      const userProfile = await tx.userProfile.create({});
      return await tx.userAccount.create({
        data: {
          username,
          password,
          email,
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

  static async getUserAccount(userId: number) {
    return await prisma.userAccount.findUnique({
      where: { userId: userId }
    });
  }

  static async checkUserAccountExists({ userId, username, email }: { userId?: number, username?: string, email?: string }) {
    return !!await prisma.userAccount.findFirst({
      where: {
        OR: [
          { userId },
          { username },
          { email }
        ]
      }
    });
  }

  static async getUserProfile(userId: number) {
    const profile = await prisma.userProfile.findUnique({
      where: { userId: userId }
    });
    if (!profile)
      throw new NotFoundError(`User profile for userId: '${userId}' does not exist`)

    return {
      fullname: profile.fullname,
      gender: profile.gender,
      avatar: profile.avatar
    };
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
