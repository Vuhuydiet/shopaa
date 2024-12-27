import express from 'express';
const router = express.Router();
import withdrawController from './withdraw.controller';
import passport from 'passport';
import authorizationMiddleware from '../../libraries/auth/authorization.middleware';
import { WithdrawStatus, Role } from '@prisma/client';
import { body, query, param } from 'express-validator';
import { handleValidationErrors } from '../../libraries/validator/validator';

// create
router.post('/',
  passport.authenticate('jwt', { session: false }),
  authorizationMiddleware.authorize([Role.SHOP_MANAGER]),
  body('amount').isNumeric().toFloat(),
  body('shopId').isNumeric().toInt(),
  handleValidationErrors,
  withdrawController.createWithdrawRequest
);

router.get('/',
  passport.authenticate('jwt', { session: false }),
  authorizationMiddleware.authorize([Role.ADMIN, Role.SHOP_MANAGER]),
  query('status').optional().custom((value:string)=>Object.values(WithdrawStatus).includes(value as WithdrawStatus)),
  query('shopId').optional().isNumeric().toInt(),
  query('postAfter').optional().isISO8601().toDate(),
  query('postBefore').optional().isISO8601().toDate(),
  query('sortBy').optional().custom((value:string)=>["createdAt"].includes(value)),
  query('order').optional().custom((value: string) => ["asc", "desc"].includes(value)),
  query('limit').optional().isNumeric().toInt(),
  query('offset').optional().isNumeric().toInt(),
  handleValidationErrors,
  withdrawController.getAllWithdraw
);


router.get('/:requestId',
  passport.authenticate('jwt', { session: false }),
  authorizationMiddleware.authorize([Role.ADMIN, Role.SHOP_MANAGER]),
  param('requestId').isNumeric().toInt(),
  handleValidationErrors,
  withdrawController.getWithdrawById
);


router.get('/shop/:shopId',
  passport.authenticate('jwt', { session: false }),
  authorizationMiddleware.authorize([Role.SHOP_MANAGER]),
  param('shopId').isNumeric().toInt(),
  handleValidationErrors,
  withdrawController.getWithdrawForShop
);


router.post('/:requestId',
  passport.authenticate('jwt', { session: false }),
  authorizationMiddleware.authorize([Role.ADMIN]),
  param('requestId').isNumeric().toInt(),
  query('status').optional().custom((value:string)=>Object.values(WithdrawStatus).includes(value as WithdrawStatus)),
  body('note').optional().isString(),
  handleValidationErrors,
  withdrawController.createWithdrawHistory,
);

router.delete('/:requestId',
  passport.authenticate('jwt', { session: false }),
  authorizationMiddleware.authorize([Role.ADMIN]),
  param('requestId').isNumeric().toInt(),
  handleValidationErrors,
  withdrawController.deleteWithdrawRequest
);

export default router;
