import prisma from "../../models";
import { BadRequestError, NotFoundError } from "../../core/ErrorResponse";
import { Role, Shop } from "@prisma/client";
import UserService from "../user/user.service";

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
    await UserService.checkUserExists(userId);

    const shop = await prisma.shop.findUnique({
      where: { shopOwnerId: userId }
    });
    if (shop)
      throw new BadRequestError('User\'s already created a shop');

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

  static async getShopById(shopId: number, includeBankingBalance = false) {
    const shop = await prisma.shop.findUnique({
      where: { shopOwnerId: shopId }
    })
    if (!shop)
      throw new NotFoundError('Shop not found');
    if (!includeBankingBalance) {
      const returnedShop = shop as Partial<Shop>;
      delete returnedShop.bankingBalance;
      return returnedShop;
    }

    return shop;
  }

  static async updateShop(shopId: number, shopData: ShopData) {
    await this.checkShopExists(shopId);

    return await prisma.shop.update({
      where: { shopOwnerId: shopId },
      data: {
        shopName: shopData.shopName,
        shopDescription: shopData.shopDescription,
        address: shopData.address
      },
      select: {
        shopName: true,
        shopDescription: true,
        address: true
      }
    });
  }

  static async deleteShop(shopId: number) {
    await this.checkShopExists(shopId);

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
