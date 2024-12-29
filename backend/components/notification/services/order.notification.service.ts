import OrderService from "../../order/order.service";
import OrderNotificationPayload from '../core/OrderNotification/orderNotificationPayload';
import notificationIoServive from "../io/notification.io.servive";
import OrderNotificationEvent from "../core/OrderNotification/orderNotification";


class OrderNotificationService {
  static async createAndSendOrderStatusChangeNotification(orderId: number) {
    const order = await OrderService.getOrderById(orderId);
    if (!order) 
      return;

    const payload = new OrderNotificationPayload(orderId, order.status, order.updatedAt);
    await notificationIoServive.createAndSend(new OrderNotificationEvent(order.customerId, payload));
    await notificationIoServive.createAndSend(new OrderNotificationEvent(order.shopId, payload));
  }
}

export default OrderNotificationService;