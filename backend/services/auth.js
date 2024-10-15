import dotenv from 'dotenv';
dotenv.config();
import fs from 'fs';
import { getPathFromBackend } from '../lib/getPath.js';
import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import db from '../models/queries.js';

const PUB_KEY = fs.readFileSync(
  getPathFromBackend('config/public_key.pem'),
  'utf8',
);

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: PUB_KEY,
  algorithms: ['RS256'],
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user_id = jwt_payload.sub;
      const user = await db.getUserById(user_id);
      if (!user) 
        return done(null, false);
      return done(null, user);
    } catch (err) {
      return done(err, false);
    }
  }),
);

export default passport.authenticate('jwt', { session: false })
