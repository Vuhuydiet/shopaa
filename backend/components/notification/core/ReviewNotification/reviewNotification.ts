import { NotificationEvent } from "../notification";

import ReviewNotificationPayload from "./reviewNotificationPayload";

class ReviewNotification extends NotificationEvent {
  constructor(userId: number, payload: ReviewNotificationPayload, createdAt: Date = new Date()) {
    super(userId, payload, createdAt);
  }

  public get eventType(): string {
    return "review";
  }
}

export default ReviewNotification;