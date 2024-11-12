import { NextFunction, Request, Response } from "express";


class BodyParser {
  static parseObject(fieldName: string) {
    return (req: Request, _res: Response, next: NextFunction) => {
      if (req.body[fieldName]) {
        req.body[fieldName] = JSON.parse(req.body[fieldName]);
      }
      next();
    }
  }

}

export default BodyParser;