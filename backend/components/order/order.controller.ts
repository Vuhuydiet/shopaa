import { Request, Response } from "express";
import { matchedData } from "express-validator";
import OrderService from "./order.service";
import { CreatedResponse, OKResponse } from "../../core/responses/SuccessResponse";
import { NotFoundError } from "../../core/responses/ErrorResponse";
import OrderNotificationService from "../notification/services/order.notification.service";
import socketPool from "../io/socketPool";


export default {

  getOrders: async (req: Request, res: Response) => {
    const queries = matchedData(req);

    const { count, orders } = await OrderService.getOrders(queries);

    new OKResponse({ message: 'Get orders successfully', metadata: { count, orders } }).send(res);
  },

  getOrderById: async (req: Request, res: Response) => {
    const { orderId } = matchedData(req);

    const order = await OrderService.getOrderById(orderId);
    if (!order)
      throw new NotFoundError('Order not found');

    new OKResponse({ message: 'Get order successfully', metadata: { order } }).send(res);
  },

  createOrder: async (req: Request, res: Response) => {
    const { userId } = req.user as any;
    const { orderData } = matchedData(req);

    const order = await OrderService.createOrder(userId, orderData);
    await OrderNotificationService.createAndSendOrderStatusChangeNotification(
      order.orderId, 
      socketPool.getSocket(order.customerId),
      socketPool.getSocket(order.shopId)
    );

    new CreatedResponse({ message: 'Order created successfully', metadata: { order } }).send(res);
  },

  updateOrderStatus: async (req: Request, res: Response) => {
    const { orderId, status } = matchedData(req);

    const order = await OrderService.updateOrderStatus(orderId, status);
    await OrderNotificationService.createAndSendOrderStatusChangeNotification(order.orderId);

    new OKResponse({ message: 'Order status updated successfully', metadata: { order } }).send(res);
  },


}