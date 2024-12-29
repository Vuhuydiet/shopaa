import { Request, Response } from "express";
import { NotFoundError } from "../../core/responses/ErrorResponse";

function notFoundHandler(req: Request, _res: Response) {
  throw new NotFoundError(`Resource not found: ${req.method} ${req.originalUrl}`);
}

export default notFoundHandler;