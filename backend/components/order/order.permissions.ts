import { OrderStatus, Role } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { ForbiddenError, NotFoundError } from "../../core/ErrorResponse";
import OrderService from "./order.service";


export default {

  alterGetOrders: async (req: Request, _res: Response, next: NextFunction) => {
    const { role } = req.user as any;

    if (role === Role.USER) {
      req.query.userId = (req.user as any).userId;
    }

    if (role === Role.SHOP_MANAGER) {
      req.query.shopId = (req.user as any).userId;
    }

    next();
  },

  canGetOrder: async (req: Request, _res: Response, next: NextFunction) => {
    const { userId, role } = req.user as any;
    const orderId = +req.params.orderId;

    const order = await OrderService.getOrderById(orderId);
    if (role === Role.USER && order?.customerId !== userId) {
      throw new ForbiddenError("You do not have permission to get this order. Order is belong to another user");
    }
    if (role === Role.SHOP_MANAGER && order?.shopId !== userId) {
      throw new ForbiddenError("You do not have permission to get this order. Order is belong to another shop");
    }

    next();
  },

  canUpdateOrderStatus: async (req: Request, _res: Response, next: NextFunction) => {
    const { userId, role } = req.user as any;
    const orderId = +req.params.orderId;
    const { status } = req.body;

    const order = await OrderService.getOrderById(orderId);

    switch (status) {
      case OrderStatus.RETURN_REQUESTED:
      case OrderStatus.RETURNED:
        throw new ForbiddenError("Only return service have permission to update this order status");
      case OrderStatus.CANCELED:
      case OrderStatus.RECEIVED:
      case OrderStatus.COMPLETED:
        if (role !== Role.USER || order?.customerId !== userId) {
          throw new ForbiddenError("Only USERs have permission to update this order status");
        }
        break;

      case OrderStatus.ACCEPTED:
      case OrderStatus.REJECTED:
        if (role !== Role.SHOP_MANAGER || order?.shopId !== userId) {
          throw new ForbiddenError("Only SHOP_MANAGERs have permission to update this order status");
        }
        break;

      case OrderStatus.DELIVERING:
      case OrderStatus.DELIVERED:
        throw new ForbiddenError("Only transportation providers have permission to update this order status");
    }

    next();
  },

  alterTransporterGetOrders: async (req: Request, _res: Response, next: NextFunction) => {
    req.query.providerId = String(req.transporter?.providerId);

    next();
  },

  canUpdateDeliveryStatus: async (req: Request, _res: Response, next: NextFunction) => {
    const orderId = +req.params.orderId;
    const { status } = req.body;

    const order = await OrderService.getOrderById(+orderId);

    if (!order) {
      throw new NotFoundError("Order not found");
    }
    
    if (status !== OrderStatus.DELIVERING && status !== OrderStatus.DELIVERED) {
      throw new ForbiddenError(`Transport providers do not have permission to update the order status to '${status}'`);
    }

    if (order.transProviderId !== req.transporter?.providerId) {
      throw new ForbiddenError("You do not have permission to update this order status. Order is not assigned to you");
    }

    next();
  }

}