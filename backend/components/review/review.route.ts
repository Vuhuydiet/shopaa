import express from 'express';
const router = express.Router();

import passport from '../../libraries/auth/authentication.middleware';
import auth from '../../libraries/auth/authorization.middleware';
import { Role } from '@prisma/client';
import { body } from 'express-validator';
import { handleValidationErrors } from '../../libraries/validator/validator';
import reviewController from './review.controller';

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  auth.authorize([Role.USER]),

  body('orderId').isInt().toInt(),
  body('orderDetailNumber').isInt().toInt(),
  body('rating').isInt({ min: 1, max: 5 }).toInt(),
  body('content').isString().notEmpty(),
  handleValidationErrors,

  reviewController.createReview
)

router.get(
  '/:reviewId',

  body('reviewId').isInt().toInt(),
  handleValidationErrors,

  reviewController.getReviewById
)

router.get(
  '/',

  body('orderId').optional().isInt().toInt(),
  body('userId').optional().isInt().toInt(),
  body('shopId').optional().isInt().toInt(),
  body('productId').optional().isInt().toInt(),
  body('rating').optional().isInt({ min: 1, max: 5 }).toInt(),
  body('offset').optional().isInt().toInt(),
  body('limit').optional().isInt().toInt(),
  body('sortBy').optional().isString().isIn(['createdAt']),
  body('order').optional().isString().isIn(['asc', 'desc']),
  handleValidationErrors,

  reviewController.getReviews
)

router.delete(
  '/:reviewId',
  passport.authenticate('jwt', { session: false }),
  auth.authorize([Role.USER]),

  body('reviewId').isInt().toInt(),
  handleValidationErrors,

  reviewController.deleteReview
)


export default router;