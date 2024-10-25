import { Request, Response, NextFunction } from 'express';
import { RequestError } from '../core/ErrorResponse.js';

const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (!(err instanceof RequestError)) {
    console.error(`Error of unknown type:\n ${err.stack}`);
    res.status(500).json({ message: 'Internal Server Error' });
    return;
  }

  console.error(err.message);
  const requestError = err as RequestError;
  res.status(requestError.statusCode || 500).json({
    message: err.message || 'Internal Server Error',
  });
};

export default errorHandler;
