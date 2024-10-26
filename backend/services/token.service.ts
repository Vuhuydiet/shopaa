import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

import prisma from '../prisma';

class TokenService {
  static async generateToken(userId: number, expiresInDays: number = 1) {
    const expiresInSeconds = expiresInDays * 24 * 60 * 60; // 1 day in seconds
    const payload = {
      sub: userId,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
    };

    const key = await prisma.key.findUnique({
      where: { name: 'JWT_PRIVATE_KEY' },
      select: { value: true },
    });

    if (!key) {
      throw new Error('JWT_PRIVATE_KEY is not defined');
    }

    return jwt.sign(payload, key.value, { algorithm: 'RS256' });
  }

  static async verifyToken(token: string) {
    const key = await prisma.key.findUnique({
      where: { name: 'JWT_PUBLIC_KEY' },
      select: { value: true },
    });

    if (!key) {
      throw new Error('JWT_PUBLIC_KEY is not defined');
    }

    return jwt.verify(token, key.value, { algorithms: ['RS256'] });
  }
}

export default TokenService;
