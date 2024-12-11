
import { Request, Response, NextFunction } from 'express';
import TransportationService from './transportation.service';
import { ForbiddenError } from '../../../core/ErrorResponse';

export default {
  
  canAccessAsTransporter: async (req: Request, _res: Response, next: NextFunction) => {
    const { key } = req.query;
    const provider = await TransportationService.getProviderByKey(key as string);

    if (!provider) {
      throw new ForbiddenError("Invalid provider key");
    }

    req.transporter = provider;

    next();
  },


}