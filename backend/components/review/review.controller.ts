import ReviewService from './review.service';
import { OKResponse, CreatedResponse } from '../../core/SuccessResponse';
import { Request, Response } from 'express';
import { matchedData } from 'express-validator';

export default {

  createReview: async (req: Request, res: Response) => {
    const { userId } = req.user as any;
    const reviewData = matchedData(req) as any;
    const review = await ReviewService.createReview(userId, reviewData);
    new CreatedResponse({ message: 'Review created successfully', metadata: review }).send(res);
  },

  getReviewById: async (req: Request, res: Response) => {
    const { reviewId } = matchedData(req) as any;
    const review = await ReviewService.getReviewById(reviewId);
    new OKResponse({ message: 'Review found', metadata: review }).send(res);
  },

  getReviews: async (req: Request, res: Response) => {
    const query = matchedData(req) as any;
    const reviews = await ReviewService.getReviews(query);
    new OKResponse({ message: 'Reviews found', metadata: reviews }).send(res);
  },

  deleteReview: async (req: Request, res: Response) => {
    const { reviewId } = matchedData(req) as any;
    await ReviewService.deleteReview(reviewId);
    new OKResponse({ message: 'Review deleted successfully' }).send(res);
  }

}