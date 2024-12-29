import { NotificationStatus } from "@prisma/client";


abstract class NotificationPayload {
  abstract stringify(): string;
}

abstract class NotificationEvent {
  constructor(userId: number, payload: NotificationPayload, createdAt: Date = new Date()) {
    this.m_UserId = userId;
    this.m_payload = payload;
    this.m_createdAt = createdAt;
    this.m_Status = NotificationStatus.UNREAD;
  }

  public stringify(): string {
    return JSON.stringify(this.toObject());
  }

  public toObject() {
    return {
      eventType: this.eventType,

      userId: this.m_UserId,
      payload: this.m_payload.stringify(),
      createdAt: this.m_createdAt,
      status: this.m_Status,
    };
  }

  public abstract get eventType(): string;

  public get userId(): number { return this.m_UserId; }
  public get payload(): NotificationPayload { return this.m_payload; }
  public get status(): NotificationStatus { return this.m_Status; }

  public markAsSent(): void { this.m_Status = NotificationStatus.UNREAD; }
  public markAsRead(): void { this.m_Status = NotificationStatus.READ; }

  // attributes
  protected m_UserId: number;
  protected m_payload: NotificationPayload;
  protected m_createdAt: Date;
  protected m_Status: NotificationStatus;
}

export { NotificationPayload, NotificationEvent };