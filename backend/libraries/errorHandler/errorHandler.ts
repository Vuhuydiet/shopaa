import { Request, Response, NextFunction } from 'express';
import { RequestError } from '../../core/responses/ErrorResponse.js';

const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
  console.error(`ERROR HANDLER:\n ${err}`);

  if (!(err instanceof RequestError)) {
    res.status(500).json({ message: 'Internal Server Error' });
    return;
  }

  const requestError = err as RequestError;
  res.status(requestError.statusCode || 500).json({
    message: err.message || 'Internal Server Error',
    error: err.error,
  });
};

export default errorHandler;
