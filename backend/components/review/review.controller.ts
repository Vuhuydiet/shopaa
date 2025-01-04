import ReviewService from './review.service';
import { OKResponse, CreatedResponse } from '../../core/responses/SuccessResponse';
import { Request, Response } from 'express';
import { matchedData } from 'express-validator';
import ReviewNotificationService from '../notification/services/review.notification.service';
import socketPool from '../io/socketPool';

export default {

  createReview: async (req: Request, res: Response) => {
    const { userId } = req.user as any;
    const reviewData = matchedData(req) as any;
    
    const review = await ReviewService.createReview(userId, reviewData);
    await ReviewNotificationService.createAndSendNewReviewNotification(review.reviewId, socketPool.getSocket(review.order.shopId));

    new CreatedResponse({ message: 'Review created successfully', metadata: review }).send(res);
  },

  getReviewById: async (req: Request, res: Response) => {
    const { reviewId } = matchedData(req) as any;
    const review = await ReviewService.getReviewById(reviewId);
    new OKResponse({ message: 'Review found', metadata: review }).send(res);
  },

  getReviews: async (req: Request, res: Response) => {
    const query = matchedData(req) as any;
    const { count, reviews } = await ReviewService.getReviews(query);
    new OKResponse({ message: 'Reviews found', metadata: { reviews, count } }).send(res);
  },

  deleteReview: async (req: Request, res: Response) => {
    const { reviewId } = matchedData(req) as any;
    await ReviewService.deleteReview(reviewId);
    new OKResponse({ message: 'Review deleted successfully' }).send(res);
  }

}