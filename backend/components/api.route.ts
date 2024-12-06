import express from 'express';
const router = express.Router();

import accessRouter from './access/access.route';
import userRouter from './user/user.route';
import shopRouter from './shop/shop.route';
import categoryRouter from './product/category/category.route';
import productRouter from './product/product.route';
import orderRouter from './order/order.route';
import transportationRouter from './order/transportation/transportation.route';

router.use('/v1/access', accessRouter);
router.use('/v1/user', userRouter);
router.use('/v1/shop', shopRouter);
router.use('/v1/category', categoryRouter);
router.use('/v1/product', productRouter);
router.use('/v1/order', orderRouter);
router.use('/v1/transportation', transportationRouter);

export default router;