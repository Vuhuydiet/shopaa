import express, { Request, Response } from 'express';
const router = express.Router();

import { servePath, indexPath, } from '../configs/serve.config';
import { NotFoundError } from '../core/ErrorResponse';
import apiRouter from './api.route';

// serve static files
if (servePath)
  router.use(express.static(servePath? servePath : ''));
router.get('/', (_req: Request, res: Response) => {
  if (!indexPath) {
    throw new NotFoundError('Index file not found');
  }
  res.sendFile(indexPath);
});

// API routes
router.use('/api', apiRouter);

export default router;
