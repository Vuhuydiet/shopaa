import dotenv from 'dotenv';
dotenv.config();

import prisma from '../prisma/index.js';

import passport from 'passport';

import { Algorithm } from 'jsonwebtoken';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import TokenService from '../services/token.service.js';
import UserService from '../services/user.service.js';


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
        const user = await prisma.userProfile.findUnique({
          where: { userId: userId },
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
        const { userId } = await UserService.createOAuthProviderIfNotExists('google', profile.id, profile.displayName);

        const token = await TokenService.generateToken(userId);
        return done(null, { token });
      }
      catch (err) {
        done(err);
      }
    })
);


if (!process.env.FACEBOOK_CLIENT_ID || !process.env.FACEBOOK_CLIENT_SECRET) {
  throw new Error('Facebook OAuth credentials are not defined in the environment variables');
}

passport.use(
  new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ['id', 'displayName']
  },
    async (_accessToken: string, _refreshToken: string, public_profile: any, done: (err: any, user?: any) => void) => {
      try {
        const { userId } = await UserService.createOAuthProviderIfNotExists('facebook', public_profile.id, public_profile.displayName);

        const token = await TokenService.generateToken(userId);
        return done(null, { token });
      }
      catch (err) {
        done(err);
      }
    })
);


export default passport;
