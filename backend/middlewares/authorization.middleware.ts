import { Request, Response, NextFunction } from 'express';
import { ForbiddenError } from '../core/ErrorResponse';
import { Role, UserProfile } from '@prisma/client';


async function authorize(roles: Role[], message?: string) {
  return async (req: Request, _res: Response, next: NextFunction) => {
    const user = req.user as UserProfile;
    if (!user)
      throw new ForbiddenError('Unauthenticated');
    if (!roles.includes(user.role))
      throw new ForbiddenError(message);
    
    next();
  }
}

export default { authorize };