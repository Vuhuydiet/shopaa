import express from 'express';
import { Request, Response } from 'express';

import { NotFoundError } from '../../core/ErrorResponse';
import { servePath, indexPath } from '../../configs/serve.config';
const router = express.Router();

if (servePath)
  router.use(express.static(servePath? servePath : ''));
router.get('/', (_req: Request, res: Response) => {
  if (!indexPath) {
    throw new NotFoundError('Index file not found');
  }
  res.sendFile(indexPath);
});

export default router;