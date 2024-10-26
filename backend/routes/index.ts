import express, { Request, Response } from 'express';
const router = express.Router();

import {
  servePath,
  serveIndexPath,
  NODE_ENV,
} from '../configs/serve.config.js';

import accessRouter from './access.route.js';

import { NotFoundError } from '../core/ErrorResponse.js';

if (NODE_ENV === 'development') {
  router.get('/', (_req: Request, _res: Response) => {
    throw new NotFoundError('Development mode, no index.html available.');
  });
} else {
  router.use(express.static(servePath));
  router.get('/', (_req: Request, res: Response) => {
    res.sendFile(serveIndexPath);
  });
}

router.use('/', accessRouter)

router.use('*', (_req: Request, _res: Response) => {
  throw new NotFoundError('Resource not found');
});

export default router;
