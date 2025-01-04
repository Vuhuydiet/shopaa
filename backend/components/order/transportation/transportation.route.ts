import express from 'express';
const router = express.Router();

import passport from '../../access/auth/authentication.middleware';
import authorizationMiddleware from '../../access/auth/authorization.middleware';
import { Role } from '@prisma/client';
import { body, param, query } from 'express-validator';
import { handleValidationErrors } from '../../../libraries/validator/validator';
import transportationController from './transportation.controller';
import permission from './transportation.permissions';

/*

  providerName  String
  contactNumber String
  contactEmail  String
  shippingFee   Float

  accessKey     String  @unique
*/

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  authorizationMiddleware.authorize([Role.ADMIN]),

  body('providerName').isString().notEmpty(),
  body('contactNumber').isMobilePhone('any').notEmpty(),
  body('contactEmail').isEmail().notEmpty(),
  body('shippingFee').isFloat().notEmpty(),
  handleValidationErrors,

  transportationController.createProvider,
);

router.get(
  '/',

  transportationController.getAllProviders,
);

router.get(
  '/:providerId',

  param('providerId').isInt().toInt(),
  handleValidationErrors,

  transportationController.getProviderById,
);

router.patch(
  '/',
  permission.canAccessAsTransporter,

  query('key').isString().notEmpty(),
  body('providerName').optional().isString(),
  body('contactNumber').optional().isMobilePhone('any'),
  body('contactEmail').optional().isEmail(),
  body('shippingFee').optional().isFloat(),
  handleValidationErrors,

  transportationController.updateProvider,
);

export default router;
