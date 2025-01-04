import express from 'express';
const router = express.Router();

import passport from '../access/auth/authentication.middleware';
import auth from '../access/auth/authorization.middleware';
import { Role } from '@prisma/client';
import { body, param, query } from 'express-validator';
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

  param('reviewId').isInt().toInt(),
  handleValidationErrors,

  reviewController.getReviewById
)

router.get(
  '/',

  query('orderId').optional().isInt().toInt(),
  query('userId').optional().isInt().toInt(),
  query('shopId').optional().isInt().toInt(),
  query('productId').optional().isInt().toInt(),
  query('rating').optional().isInt({ min: 1, max: 5 }).toInt(),
  query('offset').optional().isInt().toInt(),
  query('limit').optional().isInt().toInt(),
  query('sortBy').optional().isString().isIn(['createdAt']),
  query('order').optional().isString().isIn(['asc', 'desc']),
  handleValidationErrors,

  reviewController.getReviews
)

router.delete(
  '/:reviewId',
  passport.authenticate('jwt', { session: false }),
  auth.authorize([Role.USER]),

  param('reviewId').isInt().toInt(),
  handleValidationErrors,

  reviewController.deleteReview
)


export default router;