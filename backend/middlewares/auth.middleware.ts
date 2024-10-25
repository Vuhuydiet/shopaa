import dotenv from 'dotenv';
dotenv.config();
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Algorithm } from 'jsonwebtoken';

import prisma from '../prisma/index.js';

const key = await prisma.key.findUnique({
  where: { name: 'JWT_PUBLIC_KEY' },
  select: { value: true },
});

if (!key) {
  throw new Error('JWT_PUBLIC_KEY is not defined in the environment variables');
}

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: key.value,
  algorithms: ['RS256'] as Algorithm[],
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload: any, done: any) => {
    try {
      const userId = jwt_payload.sub;
      const user = await prisma.userAccount.findUnique({
        where: { userId: userId },
      });
      if (!user) return done(null, false);
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }),
);

export default passport.authenticate('jwt', { session: false });
