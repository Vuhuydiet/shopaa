import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../../core/ErrorResponse';
import { Role } from '@prisma/client';


function authorize(roles: Role[], message?: string) {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user)
      throw new ForbiddenError('Unauthenticated');
    const { role } = req.user as any;
    if (!roles.includes(role))
      throw new ForbiddenError(message);
    
    next();
  }
}

export default { authorize };