import { Request, Response, NextFunction } from 'express';
import { RequestError } from '../core/ErrorResponse.js';

const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  if (!(err instanceof RequestError)) {
    console.error(`ERROR HANDLER: Error of unknown type:\n ${err.stack}`);
    res.status(500).json({ message: 'Internal Server Error' });
    return;
  }

  console.error(`ERROR HANDLER: ${err.stack}`);
  const requestError = err as RequestError;
  res.status(requestError.statusCode || 500).json({
    message: err.message || 'Internal Server Error',
    error: err.error,
  });
};

export default errorHandler;
