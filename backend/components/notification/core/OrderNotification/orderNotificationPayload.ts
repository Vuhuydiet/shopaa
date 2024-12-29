import { OrderStatus } from "@prisma/client";
import { NotificationPayload } from "../notification";

class OrderNotificationPayload extends NotificationPayload {
  constructor(orderId: number, orderStatus: OrderStatus, updatedAt: Date) {
    super();
    this.m_OrderId = orderId;
    this.m_NewOrderStatus = orderStatus;
    this.m_UpdatedAt = updatedAt;
  }

  public stringify(): string {
    return JSON.stringify({
      orderId: this.m_OrderId,
      newOrderStatus: this.m_NewOrderStatus,
      updatedAt: this.m_UpdatedAt,
    });
  }

  public get orderId(): number { return this.m_OrderId; }
  public get newOrderStatus(): string { return this.m_NewOrderStatus; }
  public get updatedAt(): Date { return this.m_UpdatedAt; }

  private m_OrderId: number;
  private m_NewOrderStatus: OrderStatus;
  private m_UpdatedAt: Date;
}

export default OrderNotificationPayload;