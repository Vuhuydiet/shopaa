import express from 'express';
const router = express.Router();
import statisticsController from './statistics.controller';
import passport from '../../libraries/auth/authentication.middleware';
import authorizationMiddleware from '../../libraries/auth/authorization.middleware';
import { Role } from '@prisma/client';
import { query} from 'express-validator';
import { handleValidationErrors } from '../../libraries/validator/validator';

// Lấy doanh thu
router.get('/revenue',
  passport.authenticate('jwt', { session: false }),
  authorizationMiddleware.authorize([Role.ADMIN, Role.SHOP_MANAGER]),
  query('year').isInt().toInt(),
  query('shopId').optional().isNumeric().toInt(),
  handleValidationErrors,
  statisticsController.getRevenueByMonth
);

// Lấy thống kê sản phẩm
router.get('/products',
  passport.authenticate('jwt', { session: false }),
  authorizationMiddleware.authorize([Role.ADMIN, Role.SHOP_MANAGER]),
  query('year').isInt().toInt(),
  query('shopId').optional().isNumeric().toInt(),
  handleValidationErrors,
  statisticsController.getProductRevenueByMonth
);

// Lấy thống kê đơn hàng
router.get('/orders',
  passport.authenticate('jwt', { session: false }),
  authorizationMiddleware.authorize([Role.ADMIN, Role.SHOP_MANAGER]),
  query('year').isInt().toInt(),
  query('shopId').optional().isNumeric().toInt(),
  handleValidationErrors,
  statisticsController.getOrderStatusByMonth
);

// Lấy thống kê rút tiền
router.get('/withdrawals',
  passport.authenticate('jwt', { session: false }),
  authorizationMiddleware.authorize([Role.ADMIN]),
  query('year').isInt().toInt(),
  query('shopId').optional().isNumeric().toInt(),
  handleValidationErrors,
  statisticsController.getWithdrawalStatistics
);

export default router;
