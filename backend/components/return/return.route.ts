import express from 'express';
const router = express.Router();
import returnController from './return.controller';
import passport from '../../libraries/auth/authentication.middleware';
import authorizationMiddleware from '../../libraries/auth/authorization.middleware';
import { ReturnStatus, Role } from '@prisma/client';
import { body, query, param } from 'express-validator';
import { handleValidationErrors } from '../../libraries/validator/validator';

// get reason
router.get('/reasons', handleValidationErrors, returnController.getReason);

// Tạo return slip
router.post(
  '/',
  passport.authenticate('jwt', { session: false }),
  authorizationMiddleware.authorize([Role.USER]),
  body('orderId').isNumeric().toInt(),
  body('reason').isString(),
  body('description').isString(),
  handleValidationErrors,
  returnController.createReturnSlip,
);

// Lấy danh sách return slips
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  query('orderId').optional().isNumeric().toInt(),
  query('status')
    .optional()
    .custom((value: string) =>
      Object.values(ReturnStatus).includes(value as ReturnStatus),
    ),
  query('postAfter').optional().isISO8601().toDate(),
  query('postBefore').optional().isISO8601().toDate(),
  query('reason').optional().isString(),
  query('sortBy')
    .optional()
    .custom((value: string) => ['createdAt'].includes(value)),
  query('order')
    .optional()
    .custom((value: string) => ['asc', 'desc'].includes(value)),
  query('shopId').optional().isNumeric().toInt(),
  query('customerId').optional().isNumeric().toInt(),
  query('limit').optional().isNumeric().toInt(),
  query('offset').optional().isNumeric().toInt(),
  handleValidationErrors,
  returnController.getReturnSlips,
);

// Lấy thông tin chi tiết return slip
router.get(
  '/:returnId',
  passport.authenticate('jwt', { session: false }),
  param('returnId').isNumeric().toInt(),
  handleValidationErrors,
  returnController.getReturnSlipById,
);

// Cập nhật return slip
router.put(
  '/:returnId',
  passport.authenticate('jwt', { session: false }),
  authorizationMiddleware.authorize([Role.SHOP_MANAGER]),
  param('returnId').isNumeric().toInt(),
  body('status')
    .optional()
    .custom((value: string) =>
      Object.values(ReturnStatus).includes(value as ReturnStatus),
    ),
  body('reason').optional().isString(),
  handleValidationErrors,
  returnController.updateReturnSlip,
);

// Xóa return slip
router.delete(
  '/:returnId',
  passport.authenticate('jwt', { session: false }),
  authorizationMiddleware.authorize([Role.ADMIN]),
  param('returnId').isNumeric().toInt(),
  handleValidationErrors,
  returnController.deleteReturnSlip,
);

export default router;
