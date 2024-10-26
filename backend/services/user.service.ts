import prisma from "../prisma";

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
}

export default UserService;
