import express from 'express'

import Auth from '../../libraries/auth/authorization.middleware';
import { Role } from '@prisma/client';
import shopController from './shop.controller';
import passport from '../../libraries/auth/authentication.middleware';
import { body, param } from 'express-validator';
import { handleValidationErrors } from '../../libraries/validator/Validator';

const router = express.Router();

router.get(
  '/:shopId',
  param('shopId').isNumeric().withMessage('shopId must be a number'),
  handleValidationErrors,
  shopController.getShop
);

router.post(
  '/register',
  passport.authenticate('jwt', { session: false }),
  Auth.authorize([Role.USER], 'Only user can register a shop'),
  body('shopData').isObject().withMessage('shopData is required'),
  body('shopData.shopName').isString().withMessage('shopName must be a string'),
  handleValidationErrors,
  shopController.registerShop
);

router.patch(
  '/',
  passport.authenticate('jwt', { session: false }),
  Auth.authorize([Role.SHOP_MANAGER], 'Only shop manager can update their shop'),
  body('shopData').isObject().withMessage('shopData is required'),
  handleValidationErrors,
  shopController.updateShop
);

router.delete(
  '/',
  passport.authenticate('jwt', { session: false }),
  Auth.authorize([Role.SHOP_MANAGER, Role.ADMIN], 'Only shop manager can delete their shop'), shopController.deleteShop
);

export default router;