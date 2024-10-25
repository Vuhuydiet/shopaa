import express, { Request, Response } from 'express';
const router = express.Router();

import {
  servePath,
  serveIndexPath,
  NODE_ENV,
} from '../configs/serve.config.js';

import apiDocsRouter from './docs/index.js';

import { NotFoundError } from '../core/ErrorResponse.js';

if (NODE_ENV === 'production') {
  router.use(express.static(servePath));
  router.get('/', (_req: Request, res: Response) => {
    res.sendFile(serveIndexPath);
  });
} else {
  router.get('/', (_req: Request, _res: Response) => {
    throw new NotFoundError('Development mode, no index.html available.');
  });
}

router.use('/api-docs', apiDocsRouter);

router.use('*', (_req: Request, _res: Response) => {
  throw new NotFoundError('Resource not found');
});

export default router;
