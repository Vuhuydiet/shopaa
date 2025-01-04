import { NotificationEvent } from "../notification";

import OrderNotificationPayload from "./orderNotificationPayload";

class OrderNotificationEvent extends NotificationEvent {
  constructor(userId: number, payload: OrderNotificationPayload, createdAt: Date = new Date()) {
    super(userId, payload, createdAt);
  }

  public get eventType(): string {
    return "order";
  }
}

export default OrderNotificationEvent;