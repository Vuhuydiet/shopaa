import express from 'express';
const router = express.Router();
import reportController from './report.controller';
import passport from '../../libraries/auth/authentication.middleware';
import authorizationMiddleware from '../../libraries/auth/authorization.middleware';
import { ReportResultState, ReportType, Role } from '@prisma/client';
import { body, query, param } from 'express-validator';
import { handleValidationErrors } from '../../libraries/validator/validator';

router.post('/shop',
  passport.authenticate('jwt', { session: false }),
  authorizationMiddleware.authorize([Role.USER, Role.SHOP_MANAGER]),
  body("reportReason").isString(),
  body("description").isString(),
  body("shopId").isNumeric().toInt(),
  handleValidationErrors,
  reportController.createShopReport
)

router.post('/product',
  passport.authenticate('jwt', { session: false }),
  authorizationMiddleware.authorize([Role.USER, Role.SHOP_MANAGER]),
  body("reportReason").isString(),
  body("description").isString(),
  body("productId").isNumeric().toInt(),
  handleValidationErrors,
  reportController.createProductReport
)

router.get('/',
  passport.authenticate('jwt', { session: false }),
  authorizationMiddleware.authorize([Role.ADMIN]),
  query('unprocess').optional().isBoolean().toBoolean(),
  query('shopId').optional().isNumeric().toInt(),
  query('productId').optional().isNumeric().toInt(),
  query('postedAfter').optional().isISO8601().toDate(),
  query('postedBefore').optional().isISO8601().toDate(),
  query('type').optional().custom((value: string) => Object.values(ReportType).includes(value as ReportType)),
  query('result').optional().custom((value: string) => Object.values(ReportResultState).includes(value as ReportResultState)),
  query('category').optional().isString(),
  query('sortBy').optional().custom((value: string) => ["createdAt"].includes(value)),
  query('order').optional().custom((value: string) => ["asc", "desc"].includes(value)),
  query('offset').optional().isString(),
  query('limit').optional().isString(),
  handleValidationErrors,
  reportController.getReports
)

router.get('/:reportId',
  passport.authenticate('jwt', { session: false }),
  authorizationMiddleware.authorize([Role.ADMIN]),
  param('reportId').isNumeric().toInt(),
  handleValidationErrors,
  reportController.getReportById
)

router.delete('/:reportId',
  passport.authenticate('jwt', { session: false }),
  authorizationMiddleware.authorize([Role.ADMIN]),
  param('reportId').isNumeric().toInt(),
  handleValidationErrors,
  reportController.deleteReport
)

router.post('/:reportId/result',
  passport.authenticate('jwt', { session: false }),
  authorizationMiddleware.authorize([Role.ADMIN]),
  param('reportId').isNumeric().toInt(),
  body('result').custom((value: string) => Object.values(ReportResultState).includes(value as ReportResultState)),
  body('reason').optional().isString(),
  handleValidationErrors,
  reportController.createReportResult

)

router.delete('/:reportId/result',
  passport.authenticate('jwt', { session: false }),
  authorizationMiddleware.authorize([Role.ADMIN]),
  param('reportId').isNumeric().toInt(),
  handleValidationErrors,
  reportController.deleteReportResult
)

export default router;