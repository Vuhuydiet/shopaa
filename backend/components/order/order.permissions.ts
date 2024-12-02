import { OrderStatus, Role } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { ForbiddenError, NotFoundError } from "../../core/ErrorResponse";
import OrderService from "./order.service";
import Transportation from "./transportation/transportation.service";


export default {

  alterGetOrders: async (req: Request, _res: Response, next: NextFunction) => {
    const { role } = req.user as any;

    if (role === Role.USER) {
      req.query.userId = (req.user as any)?.userId;
    }

    if (role === Role.SHOP_MANAGER) {
      req.query.shopId = (req.user as any)?.shopId;
    }

    next();
  },

  canGetOrder: async (req: Request, _res: Response, next: NextFunction) => {
    const { userId, role } = req.user as any;
    const orderId = +req.params.orderId;

    const order = await OrderService.getOrderById(orderId);
    if (role === Role.USER && order?.customerId !== userId) {
      throw new ForbiddenError("You do not have permission to get this order");
    }
    if (role === Role.SHOP_MANAGER && order?.shopId !== userId) {
      throw new ForbiddenError("You do not have permission to get this order");
    }

    next();
  },

  canUpdateOrderStatus: async (req: Request, _res: Response, next: NextFunction) => {
    const { userId, role } = req.user as any;
    const orderId = +req.params.orderId;
    const { status } = req.body;

    const order = await OrderService.getOrderById(orderId);

    switch (status) {
      case OrderStatus.CANCELED:
      case OrderStatus.RECEIVED:
      case OrderStatus.RETURNED:
      case OrderStatus.COMPLETED:
        if (role !== Role.USER || order?.customerId !== userId) {
          throw new ForbiddenError("You do not have permission to update this order status");
        }
        break;

      case OrderStatus.ACCEPTED:
      case OrderStatus.REJECTED:
        if (role !== Role.SHOP_MANAGER || order?.shopId !== userId) {
          throw new ForbiddenError("You do not have permission to update this order status");
        }
        break;

      case OrderStatus.DELIVERING:
      case OrderStatus.DELIVERED:
        throw new ForbiddenError("Only transportation providers have permission to update this order status");
    }

    next();
  },

  canAccessAsTransporter: async (req: Request, _res: Response, next: NextFunction) => {
    const { key } = req.query;
    const provider = await Transportation.getProviderByKey(key as string);

    if (!provider) {
      throw new ForbiddenError("Invalid provider key");
    }

    req.transporter = provider;

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
      throw new ForbiddenError(`You cannot update the order status to '${status}'`);
    }

    if (order.transProviderId !== req.transporter?.providerId) {
      throw new ForbiddenError("You do not have permission to update this order status");
    }

    next();
  }

}