import express from 'express';
const router = express.Router();

import accessRouter from './access.route';
import userRouter from './user.route';
import shopRouter from './shop.route';
import categoryRouter from './category.route';
import productRouter from './product.route';


router.use('/v1/access', accessRouter);
router.use('/v1/user', userRouter);
router.use('/v1/shop', shopRouter);
router.use('/v1/category', categoryRouter);
router.use('/v1/product', productRouter);

export default router;