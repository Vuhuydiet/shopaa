import ReviewService from "../../review/review.service";
import ReviewNotification from "../core/ReviewNotification/reviewNotification";
import ReviewNotificationPayload from "../core/ReviewNotification/reviewNotificationPayload";
import notificationIoServive from "../io/notification.io.servive";

class ReviewNotificationService {
  static async createAndSendNewReviewNotification(reviewId: number) {
    const review = await ReviewService.getReviewById(reviewId);
    if (!review) 
      return;

    const userId = review.order.shop.shopOwnerId;
    const payload = new ReviewNotificationPayload(reviewId, review.productId, review.createdAt);
    await notificationIoServive.createAndSend(new ReviewNotification(userId, payload));
  }
}

export default ReviewNotificationService;