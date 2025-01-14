import express from 'express';
const router = express.Router();

import indexRouter from './index.route';

router.use('/', indexRouter);

export default router;