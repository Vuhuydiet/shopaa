import express from 'express';
const router = express.Router();

import accessRouter from './access/access.route';
import userRouter from './user/user.route';
import shopRouter from './shop/shop.route';
import categoryRouter from './product/category/category.route';
import productRouter from './product/product.route';
import orderRouter from './order/order.route';
import transportationRouter from './order/transportation/transportation.route';
import reportRouter from './report/report.route';
import cartRouter from './cart/cart.route';
import reviewRouter from './review/review.route';
import returnRouter from './return/return.route';
import notificationRouter from './notification/notification.route';
import withdrawRouter from './withdraw/withdraw.route';
import stastisticsRouter from './statistics/statistics.route';

router.use('/v1/access', accessRouter);
router.use('/v1/user', userRouter);
router.use('/v1/shop', shopRouter);
router.use('/v1/category', categoryRouter);
router.use('/v1/product', productRouter);
router.use('/v1/order', orderRouter);
router.use('/v1/transportation', transportationRouter);
router.use('/v1/report', reportRouter);
router.use('/v1/cart', cartRouter);
router.use('/v1/review', reviewRouter);
router.use('/v1/return', returnRouter);
router.use('/v1/notification', notificationRouter);
router.use('/v1/withdraw', withdrawRouter);
router.use('/v1/statistics', stastisticsRouter);

export default router;
