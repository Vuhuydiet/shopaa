import OrderService from "../../order/order.service";
import OrderNotificationPayload from '../core/OrderNotification/orderNotificationPayload';
import notificationIoServive from "../io/notification.io.servive";
import OrderNotificationEvent from "../core/OrderNotification/orderNotification";
import { Socket } from "socket.io";


class OrderNotificationService {
  static async createAndSendOrderStatusChangeNotification(orderId: number, customer_socket?: Socket, shop_socket?: Socket) {
    const order = await OrderService.getOrderById(orderId);
    if (!order) 
      return;

    const payload = new OrderNotificationPayload(orderId, order.status, order.updatedAt);
    await notificationIoServive.createAndSend(new OrderNotificationEvent(order.customerId, payload), customer_socket);
    await notificationIoServive.createAndSend(new OrderNotificationEvent(order.shopId, payload), shop_socket);
  }
}

export default OrderNotificationService;