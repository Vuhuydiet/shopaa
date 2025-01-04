import { NotificationPayload } from "../notification";

class ReviewNotificationPayload extends NotificationPayload {
  constructor(reviewId: number, productId: number, createdAt: Date) {
    super();
    this.m_ReviewId = reviewId;
    this.m_ProductId = productId;
    this.m_CreatedAt = createdAt;
  }

  public stringify(): string {
    return JSON.stringify({
      reviewId: this.m_ReviewId,
      productId: this.m_ProductId,
      updatedAt: this.m_CreatedAt,
    });
  }

  public get reviewId(): number { return this.m_ReviewId; }
  public get updatedAt(): Date { return this.m_CreatedAt; }

  private m_ReviewId: number;
  private m_ProductId: number;
  private m_CreatedAt: Date;
}

export default ReviewNotificationPayload;