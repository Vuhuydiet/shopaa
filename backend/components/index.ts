import express from 'express';
const router = express.Router();

import publicRouter from './public';
import apiRouter from './api.route';

// serve static files
router.use('/', publicRouter);

// API routes
router.use('/api', apiRouter);

export default router;