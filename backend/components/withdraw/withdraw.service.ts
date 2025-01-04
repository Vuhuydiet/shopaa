import { WithdrawStatus } from "@prisma/client";
import prisma from "../../models";
import { NotFoundError, BadRequestError } from "../../core/ErrorResponse";

type WithdrawData = {
 // requestId: number;
  amount: number;
  shopId: number;
}
type WithdrawQuery = {
  requestId: number;
  postAfter?: Date;
  postBefore?: Date;
  sortBy?: 'createdAt';
  order?: 'asc' | 'desc';
  shopId?: number;
  offset?: number;
  limit?: number;
};

type UpdateWithdrawData = {
  requestId: number;
  createdAt?: Date;
  status?: WithdrawStatus;
  note?: string;
  shopId?: number;
}


class WithdrawService {
  static async createWithdrawRequest(data: WithdrawData) {
    const shop = await prisma.shop.findUnique({
      where: {
        shopOwnerId: data.shopId,
      },
    });

    if (!shop)
      throw new NotFoundError('Shop not found');

    if (data.amount <= 0) throw new BadRequestError('Amount must be greater than 0');

    if (data.amount > shop.bankingBalance) {
      throw new BadRequestError('Amount exceeds the available banking balance');
    }

    return await prisma.withdrawRequest.create({
      data: {
        amount: data.amount,
        shopOwnerId: data.shopId
      }
    });
  }


  static async getAllWithdraw(query: WithdrawQuery) {
    if (query.shopId) {
      const shop = await prisma.shop.findUnique({
        where: {
          shopOwnerId: query.shopId
        }
      });

      if (!shop)
        throw new NotFoundError('Shop not found')
    }

    return await prisma.withdrawRequest.findMany({
      where: {
        shopOwnerId: query.shopId,
        createdAt: {
          gte: query.postAfter,
          lte: query.postBefore,
        },
      },
      orderBy: query.sortBy
        ? {
          [query.sortBy as string]: query.order
        } : undefined,
      take: query.limit,
      skip: query.offset,
      include: {
        requesthistory: true,
      }
    });
  }

  // get withdraw by ID
  static async getWithdrawById(requestId: number) {
    const withdraw = await prisma.withdrawRequest.findUnique({
      where: { requestId },
      include: {
        requesthistory: true,
      }
    });

    if (!withdraw) throw new NotFoundError("Withdraw not found");

    return withdraw;
  }

  // create withdrawHistory
  static async createWithdrawHistory(data: UpdateWithdrawData, handlerId: number) {
    const validStatuses = Object.values(WithdrawStatus); 
    if (data.status && !validStatuses.includes(data.status)) {
      throw new BadRequestError(`Invalid status: ${data.status}`);
    }
  
    const existingRequest = await prisma.withdrawRequest.findUnique({
      where: { requestId: data.requestId },
    });
  
    if (!existingRequest) {
      throw new NotFoundError("Request with the given ID does not exist.");
    }
  
    const shop = await prisma.shop.findUnique({
      where: { shopOwnerId: existingRequest.shopOwnerId }
    });
  
    if (!shop) {
      throw new NotFoundError('Shop not found');
    }
  
    if (data.status === WithdrawStatus.ACCEPTED) {
      if (existingRequest.amount > shop.bankingBalance) {
        throw new BadRequestError('Amount exceeds the available banking balance');
      }
  
      // Cập nhật bankingBalance của shop sau khi rút tiền
      await prisma.shop.update({
        where: { shopOwnerId: existingRequest.shopOwnerId },
        data: {
          bankingBalance: shop.bankingBalance - existingRequest.amount
        }
      });
    }
  
    return await prisma.withdrawHistory.create({
      data: {
        requestId: data.requestId,
        handler: handlerId,
        status: data.status ,
        note: data.note || "No notes provided.",
      },
    });
  }
  


  // get withdraw for shop
  static async getWithdrawForShop(shopId:number) {
    const shop = await prisma.shop.findUnique({
      where: { shopOwnerId: shopId }
    });
    if (!shop)
      throw new NotFoundError('Shop not found');

    const withdrawRequests = await prisma.withdrawRequest.findMany({
      where: {
        shopOwnerId: shopId,
      },
      include: {
        requesthistory: true,
      },
    });
    return withdrawRequests;
  }

  static async deleteWithdrawRequest(requestId: number) {
    const withdrawRequest = await prisma.withdrawRequest.delete({
      where: { requestId: requestId },
    });
    return withdrawRequest;
  }

}

export default WithdrawService;