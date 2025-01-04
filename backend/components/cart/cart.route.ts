import express from 'express';
import cartController from './cart.controller';
const router = express.Router();

import passport from '../access/auth/authentication.middleware';
import Auth from '../access/auth/authorization.middleware';
import { Role } from '@prisma/client';
import { body, param, query } from 'express-validator';
import { handleValidationErrors } from '../../libraries/validator/validator';

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  Auth.authorize([Role.USER]),

  body('productId').isNumeric(),
  body('color').optional().isString(),
  body('size').optional().isString(),
  handleValidationErrors,

  cartController.createCartItem
);

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  Auth.authorize([Role.USER]),

  query('limit').optional().isNumeric().toInt(),
  query('offset').optional().isNumeric().toInt(),
  handleValidationErrors,

  cartController.getCartItems
);

router.delete(
  '/:cartItemId',
  passport.authenticate('jwt', { session: false }),
  Auth.authorize([Role.USER]),

  param('cartItemId').isNumeric().toInt(),
  handleValidationErrors,
  
  cartController.deleteCartItem
);

export default router;