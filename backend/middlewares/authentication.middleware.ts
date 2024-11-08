import dotenv from 'dotenv';
dotenv.config();

import keyConfig from '../configs/key.config'

import passport from 'passport';

import { Algorithm } from 'jsonwebtoken';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import UserService from '../services/user.service';

passport.use(
  new JwtStrategy({
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: keyConfig.JWT_PUBLIC_KEY,
    algorithms: ['RS256'] as Algorithm[],
  },
    async (jwt_payload: any, done: any) => {
      try {
        const { userId } = jwt_payload.sub;
        await UserService.checkUserExists(userId);
        const userProfile = await UserService.getUserProfile(userId, true);
        return done(null, { userId, role: (userProfile as any).role });
      } catch (err) {
        return done(err, false);
      }
    }),
);

// ----------------------------------------------------------- //
// ----------------- OAuth Strategies ------------------------ //
// ----------------------------------------------------------- //
passport.use(
  new GoogleStrategy({
    clientID: keyConfig.GOOGLE_CLIENT_ID,
    clientSecret: keyConfig.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
    async (_accessToken: string, _refreshToken: string, profile: any, done: (err: any, user?: any) => void) => {
      try {
        const user = await UserService.createOAuthProviderIfNotExists('google', profile.id, profile.displayName);
        return done(null, user);
      }
      catch (err) {
        done(err);
      }
    })
);



passport.use(
  new FacebookStrategy({
    clientID: keyConfig.FACEBOOK_CLIENT_ID,
    clientSecret: keyConfig.FACEBOOK_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/facebook/callback",
    profileFields: ['id', 'displayName']
  },
    async (_accessToken: string, _refreshToken: string, public_profile: any, done: (err: any, user?: any) => void) => {
      try {
        const user = await UserService.createOAuthProviderIfNotExists('facebook', public_profile.id, public_profile.displayName);
        return done(null, user);
      }
      catch (err) {
        done(err);
      }
    })
);

export default passport;