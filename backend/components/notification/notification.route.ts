import express from 'express';
const router = express.Router();
import passport from '../access/auth/authentication.middleware';
import { query } from 'express-validator';
import { NotificationStatus } from '@prisma/client';
import notificationController from './notification.controller';

router.get(
  '/',
  passport.authenticate('jwt', { session: false }),

  query('status')
    .optional()
    .custom((value: string) =>
      Object.values(NotificationStatus).includes(value as NotificationStatus),
    ),
  query('type').optional().isIn(['order', 'review', 'system']),
  query('from').optional().isISO8601().toDate(),
  query('to').optional().isISO8601().toDate(),
  query('limit').optional().isInt().toInt(),
  query('offset').optional().isInt().toInt(),

  notificationController.getNotifications,
);

export default router;
