import { Gender } from '@prisma/client';
import { NotFoundError } from '../../core/ErrorResponse';
import prisma from '../../models'
import ImageService from '../image/image.service';

type ProfileData = {
  fullname?: string;
  dateOfBirth?: Date;
  gender?: Gender;
  phoneNumber?: string;
  avatar?: Express.Multer.File;
}

class UserService {

  static async checkUserExists(userId: number) {
    const user = await prisma.userProfile.findUnique({
      where: { userId: userId }
    });

    if (!user)
      throw new NotFoundError(`User with userId: '${userId}' does not exist`);
    return user;
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
      where: { userId: userId },
      include: {
        avatarImage: true
      }
    });
    if (!profile)
      throw new NotFoundError(`User profile for userId: '${userId}' does not exist`)

    if (!includeSensitiveData) {
      return {
        userId: profile.userId,
        fullname: profile.fullname,
        avatarImage: profile.avatarImage,
        gender: profile.gender
      }
    }

    return profile;
  }

  static async updateUserProfile(userId: number, newProfileData: ProfileData) {
    const oldProfile = await this.checkUserExists(userId);

    return await prisma.$transaction(async (tx) => {
      if (newProfileData.avatar !== undefined && oldProfile.avatarImageId) {
        await ImageService.deleteImage(oldProfile.avatarImageId, tx);
      }
      const newImage = newProfileData.avatar ? await ImageService.createImage(newProfileData.avatar, tx) : undefined;

      return await tx.userProfile.update({
        where: { userId: userId },
        data: {
          fullname: newProfileData.fullname,
          dateOfBirth: newProfileData.dateOfBirth,
          phoneNumber: newProfileData.phoneNumber,
          avatarImageId: newImage?.imageId,
          gender: newProfileData.gender
        },
        include: {
          avatarImage: true
        }
      });
    });
  }

  static async deleteUser(userId: number) {
    await this.checkUserExists(userId);

    return await prisma.$transaction(async (tx) => {
      const userProfile = await tx.userProfile.findUnique({
        where: { userId: userId },
        include: {
          avatarImage: true
        }
      });

      if (userProfile?.avatarImageId) {
        await ImageService.deleteImage(userProfile.avatarImageId, tx);
      }

      await tx.userProfile.delete({
        where: { userId: userId }
      });
    });
  }
}


export default UserService;
