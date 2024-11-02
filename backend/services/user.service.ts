import prisma from "../prisma";
import { BadRequestError, NotFoundError } from "../core/ErrorResponse";

type ProfileData = {
  fullname?: string;
  dateOfBirth?: Date;
  gender?: string;
  phoneNumber?: string;
  avatar?: string;
}

class UserService {

  static async checkUserExists(userId: number) {
    const user = await prisma.userProfile.findUnique({
      where: { userId: userId }
    });

    if (!user)
      throw new NotFoundError(`User with userId: '${userId}' does not exist`);
  }

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
    const account = await prisma.userAccount.findUnique({
      where: { userId: userId }
    });
    if (!account)
      throw new NotFoundError(`User account for userId: '${userId}' does not exist`);
    
    return account;
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

  static async getUserProfile(userId: number, includeSensitiveData = false) {
    const profile = await prisma.userProfile.findUnique({
      where: { userId: userId }
    });
    if (!profile)
      throw new NotFoundError(`User profile for userId: '${userId}' does not exist`)

    if (!includeSensitiveData) {
      return {
        userId: profile.userId,
        fullname: profile.fullname,
        avatar: profile.avatar,
        gender: profile.gender
      }
    }

    return profile;
  }

  static async updateUserProfile(userId: number, newProfile: ProfileData) {
    await this.checkUserExists(userId);

    try {
      await prisma.userProfile.update({
        where: { userId: userId },
        data: {
          fullname: newProfile.fullname,
          dateOfBirth: newProfile.dateOfBirth,
          phoneNumber: newProfile.phoneNumber,
          avatar: newProfile.avatar,
          gender: newProfile.gender
        },
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
