import prisma from "../prisma";
import { BadRequestError, NotFoundError } from "../core/ErrorResponse";
import { Role } from "@prisma/client";

type ShopData = {
  shopName: string;
  shopDescription?: string;
  address?: string;
}

class ShopService {

  static async checkShopExists(shopId: number) {
    const shop = await prisma.shop.findUnique({
      where: { shopOwnerId: shopId }
    });

    if (!shop)
      throw new NotFoundError('Shop not found');
  }

  static async createShop(userId: number, shopdata: ShopData) {
    const user = await prisma.userProfile.findUnique({
      where: { userId: userId }
    })
    if (!user)
      throw new NotFoundError('User not found, cannot create shop');

    const shop = await prisma.shop.findUnique({
      where: { shopOwnerId: userId }
    });
    if (shop)
      throw new BadRequestError('User\'s already created a shop exists');

    return await prisma.$transaction(async (tx) => {
      await tx.shop.create({
        data: {
          ...shopdata,
          shopOwner: {
            connect: {
              userId: userId
            },
          }
        },
      });
      await tx.userProfile.update({
        where: { userId: userId },
        data: { role: Role.SHOP_MANAGER }
      });
    });
  }

  static async getShop(shopId: number) {
    const shop = await prisma.shop.findUnique({
      where: { shopOwnerId: shopId }
    })
    if (!shop)
      throw new NotFoundError('Shop not found');

    return shop;
  }

  static async updateShop(shopId: number, shopData: ShopData) {
    this.checkShopExists(shopId);

    return await prisma.shop.update({
      where: { shopOwnerId: shopId },
      data: shopData,
      select: {
        shopName: true,
        shopDescription: true,
        address: true
      }
    });
  }

  static async deleteShop(shopId: number) {
    this.checkShopExists(shopId);

    await prisma.$transaction(async (tx) => {
      await prisma.shop.delete({
        where: { shopOwnerId: shopId }
      });
      await tx.userProfile.update({
        where: { userId: shopId },
        data: { role: Role.USER }
      });
    });
  }

}

export default ShopService;
