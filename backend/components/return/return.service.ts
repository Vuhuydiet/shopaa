import { OrderStatus, ReturnStatus } from "@prisma/client";
import prisma from "../../models";
import { NotFoundError, BadRequestError } from "../../core/responses/ErrorResponse";
import OrderService from "../order/order.service";

type ReturnSlipData = {
  orderId: number;
  reason: string;
  description: string;
};

type ReturnQuey = {
  orderId: number;
  status?: ReturnStatus;
  postAfter?: Date;
  postBefore?: Date;
  reason?: string;
  sortBy?: 'createdAt';
  order?: 'asc' | 'desc';
  shopId?: number;
  customerId?: number;
  offset?: number;
  limit?: number;
};

type UpdateReturnSlipData = {
  status?: ReturnStatus;
  reason?: string;
};

class ReturnService {
  static async createReturnSlip(returnData: ReturnSlipData) {
    const order = await prisma.order.findUnique({
      where: { orderId: returnData.orderId },
      include: { customer: true, shop: true },
    });


    if (!order) throw new NotFoundError(`Order not found`);
    if (!order.customer) throw new NotFoundError(`Customer not found for this order`);
    if (!order.shop) {
      throw new NotFoundError(`Shop not found for this order`);
    }

    if(order.status!=OrderStatus.RECEIVED)
      throw new BadRequestError("Order has not been received");
    

    const reason = await prisma.returnReason.findUnique({
      where: { categoryName: returnData.reason },
    });
    if (!reason) throw new NotFoundError(`Reason not found`);

    const existingReturnSlip = await prisma.returnSlip.findFirst({
      where: {
        orderId: returnData.orderId,
      },
    });

    if (existingReturnSlip) {
      throw new BadRequestError(`A return slip for this order already exists`);
    }

    await OrderService.updateOrderStatus(returnData.orderId, OrderStatus.RETURN_REQUESTED);

    return await prisma.returnSlip.create({
      data: {
        orderId: returnData.orderId,
        description: returnData.description,
        status: ReturnStatus.PENDING,
        reason: returnData.reason,
      },
    });
  }

  static async getReturnSlips(query: ReturnQuey) {
    return await prisma.returnSlip.findMany({
      where: {
        orderId: query.orderId,
        status: query.status,
        createdAt: {
          gte: query.postAfter,
          lte: query.postBefore,
        },
        reason: query.reason,
        order: { shopId: query.shopId, customerId: query.customerId },
      },
      orderBy: query.sortBy
        ? {
          [query.sortBy]: query.order,
        }
        : undefined,
      take: query.limit,
      skip: query.offset,
      include: {
        returnCategory: true,
        order: true,
      },
    });
  }

  // get return slip by id
  static async getReturnSlipById(returnId: number) {
    const returnSlip = await prisma.returnSlip.findUnique({
      where: { returnId },
      include: {
        returnCategory: true,
        order: true,
      },
    });

    if (!returnSlip) throw new NotFoundError("Return slip not found");

    return returnSlip;
  }

  static async getReason(){
    const reasons = await prisma.returnReason.findMany({
    });

    if (!reasons || reasons.length === 0) {
      throw new NotFoundError('No return reasons found');
    }

    return reasons;
  }


  // update return slip
  static async updateReturnSlip(returnId: number, data: UpdateReturnSlipData) {
    const returnSlip = await prisma.returnSlip.findUnique({
      where: { returnId },
    });

    if (!returnSlip) throw new NotFoundError("Return slip not found");

    if (data.status) {
      if (returnSlip.status != ReturnStatus.PENDING)
        throw new BadRequestError("Can't update status because return has been resolved");

      if (data.status == ReturnStatus.PENDING)
        throw new BadRequestError("Can't update status to pending");
      let newOrderStatus

      if (data.status == ReturnStatus.ACCEPTED)
        newOrderStatus = OrderStatus.RETURNED
      else if (data.status == ReturnStatus.DISMISSED)
        newOrderStatus = OrderStatus.COMPLETED


      await prisma.order.update({
        where: {
          orderId: returnSlip.orderId,
        },
        data: { status: newOrderStatus },
      });
    }

    return await prisma.returnSlip.update({
      where: { returnId },
      data:{
        status: data.status,
        result: data.reason
      }
    });

  }

  // delete return slip
  static async deleteReturnSlip(returnId: number) {
    const returnSlip = await prisma.returnSlip.findUnique({
      where: { returnId },
    });

    if (!returnSlip) throw new NotFoundError("Return slip not found");

    return await prisma.returnSlip.delete({
      where: { returnId },
    });
  }
}

export default ReturnService;
