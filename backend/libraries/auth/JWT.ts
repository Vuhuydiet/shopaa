import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

import keyConfig from '../../configs/key.config';

class JWT {
  static generateToken(userId: number, expiresInDays: number = 1) {
    const expiresInSeconds = expiresInDays * 24 * 60 * 60; // 1 day in seconds
    const payload = {
      sub: {
        userId: userId
      },
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
    };

    return jwt.sign(payload, keyConfig.JWT_PRIVATE_KEY, { algorithm: 'RS256' });
  }

  static verifyToken(token: string) {
    return jwt.verify(token, keyConfig.JWT_PUBLIC_KEY, { algorithms: ['RS256'] }) as jwt.JwtPayload;
  }
}

export default JWT;
