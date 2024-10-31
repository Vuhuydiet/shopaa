import express, { Request, Response } from 'express';
const router = express.Router();

import { servePath, serveIndexPath, NODE_ENV, } from '../configs/serve.config';
import { NotFoundError } from '../core/ErrorResponse';

import { authenticateJWT } from '../middlewares/authenticate.middleware';
import accessRouter from './access.route';
import userRouter from './user.route';

// serve static files
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

// passport middleware
router.use(authenticateJWT);

// public routes
router.use('/', accessRouter);
router.use('/user', userRouter);


// catch all 404 error
router.use('*', (_req: Request, _res: Response) => {
  throw new NotFoundError('Resource not found');
});

export default router;
