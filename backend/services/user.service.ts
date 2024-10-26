import prisma from "../prisma";

class UserService {
  static async createOAuthProvider(providerName: string, profile: any) {
    return await prisma.$transaction(async (tx) => {
      const userProfile = await tx.userProfile.create({
        data: {
          fullname: profile.displayName,
        },
      })
      return await tx.oAuthProvider.create({
        data: {
          providerUID: profile.id,
          providerName: providerName,
          profile: {
            connect: {
              userId: userProfile.userId,
            }
          }
        },
        include: {
          profile: true,
        }
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
        include: {
          profile: true,
        }
      });
    })
  }
}

export default UserService;
