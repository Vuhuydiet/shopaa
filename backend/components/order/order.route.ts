import express from 'express';
const router = express.Router();

import { body, query, param } from 'express-validator';

import orderController from './order.controller';
import passport from '../../libraries/auth/authentication.middleware';
import orderPermissions from './order.permissions';
import { OrderStatus, Role } from '@prisma/client';
import { handleValidationErrors } from '../../libraries/validator/validator';
import auth from '../../libraries/auth/authorization.middleware';
import transportationPermissions from './transportation/transportation.permissions';

const orderDataValidator = () => {
  return [
    body('orderData').isObject(),
    body('orderData.shippingAddress').isString(),
    body('orderData.transProvider').isInt().toInt(),
    body('orderData.products').isArray(),
    body('orderData.products.*.productId').isInt().toInt(),
    body('orderData.products.*.quantity').isInt().toInt(),
    body('orderData.products.*.color').optional().isString(),
    body('orderData.products.*.size').optional().isString(),
  ];
};

const queryValidator = () => {
  return [
    query('userId').optional().isInt().toInt(),
    query('shopId').optional().isInt().toInt(),
    query('providerId').optional().isInt().toInt(),
    query('product').optional().isInt().toInt(),
    query('status')
      .optional()
      .custom((value: string) =>
        Object.values(OrderStatus).includes(value as OrderStatus),
      ),
    query('createdAfter').optional().isISO8601().toDate(),
    query('createdBefore').optional().isISO8601().toDate(),
    query('minValue').optional().isNumeric().toFloat(),
    query('maxValue').optional().isNumeric().toFloat(),
    query('sortBy')
      .optional()
      .custom((value: string) => ['createdAt', 'totalAmount'].includes(value)),
    query('order')
      .optional()
      .custom((value: string) => ['asc', 'desc'].includes(value)),
    query('offset').optional().isNumeric().toInt(),
    query('limit').optional().isNumeric().toInt(),
  ];
};

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  orderPermissions.alterGetOrders,

  queryValidator(),
  handleValidationErrors,

  orderController.getOrders,
);

router.get(
  '/user/:orderId',
  passport.authenticate('jwt', { session: false }),
  orderPermissions.canGetOrder,

  param('orderId').isInt().toInt(),
  handleValidationErrors,

  orderController.getOrderById,
);

router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  auth.authorize([Role.USER]),

  orderDataValidator(),
  handleValidationErrors,

  orderController.createOrder,
);

router.patch(
  '/:orderId',
  passport.authenticate('jwt', { session: false }),
  orderPermissions.canUpdateOrderStatus,

  param('orderId').isInt().toInt(),
  body('status').custom((value: string) =>
    Object.values(OrderStatus).includes(value as OrderStatus),
  ),
  handleValidationErrors,

  orderController.updateOrderStatus,
);

// FOR TRANSPORTATION PROVIDER

router.get(
  '/transportation',
  transportationPermissions.canAccessAsTransporter,
  orderPermissions.alterTransporterGetOrders,

  queryValidator(),
  handleValidationErrors,

  orderController.getOrders,
);

router.patch(
  '/transportation/:orderId',
  transportationPermissions.canAccessAsTransporter,
  orderPermissions.canUpdateDeliveryStatus,

  param('orderId').isInt().toInt(),
  body('status').custom((value: string) =>
    (Object.values(OrderStatus) as string[]).includes(value),
  ),
  handleValidationErrors,

  orderController.updateOrderStatus,
);

export default router;
