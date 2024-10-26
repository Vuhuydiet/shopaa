import dotenv from 'dotenv';
dotenv.config();

import prisma from '../prisma/index.js';

import passport from 'passport';

import { Algorithm } from 'jsonwebtoken';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import OAuthService from '../services/user.service.js';
import TokenService from '../services/token.service.js';


const key = await prisma.key.findUnique({
  where: { name: 'JWT_PUBLIC_KEY' },
  select: { value: true },
});

if (!key) {
  throw new Error('JWT_PUBLIC_KEY is not defined');
}

passport.use(
  new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: key.value,
    algorithms: ['RS256'] as Algorithm[],
  },
    async (jwt_payload: any, done: any) => {
      try {
        const userId = jwt_payload.sub;
        const user = await prisma.userAccount.findUnique({
          where: { userId: userId },
          include: {
            profile: true,
          }
        });
        return done(null, user);
      } catch (err) {
        return done(err, false);
      }
    }),
);


if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  throw new Error('Google OAuth credentials are not defined in the environment variables');
}

passport.use(
  new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
    async (_accessToken: string, _refreshToken: string, profile: any, done: (err: any, user?: any) => void) => {
      try {
        let user = await prisma.oAuthProvider.findUnique({
          where: { providerName_providerUID: { providerName: 'google', providerUID: profile.id } },
          include: {
            profile: true,
          }
        });

        if (!user) {
          user = await OAuthService.createOAuthProvider('google', profile);
        }

        const token = await TokenService.generateToken(user.userId);
        return done(null, { token });
      }
      catch (err) {
        done(err);
      }
    })
);

export default passport;
