import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import { getPathFromBackend } from './getPath.js';

import db from '../models/queries.js';
import exp from 'constants';

const PRIV_KEY = fs.readFileSync(
  getPathFromBackend('config/private_key.pem'),
  'utf8',
);

const PUB_KEY = fs.readFileSync(
  getPathFromBackend('config/public_key.pem'),
  'utf8',
);

const saltLength = 16;
const iterations = 10000;
const keyLength = 64;
const digest = 'sha512';

function getHashPassword(password) {
  const salt = crypto.randomBytes(saltLength).toString('hex');
  const hash = crypto
    .pbkdf2Sync(password, salt, iterations, keyLength, digest)
    .toString('hex');
  return `${salt}:${hash}`;
}

function invalidatePassword(inputPassword, storedHash) {
  const [salt, originalHash] = storedHash.split(':');
  const hash = crypto
    .pbkdf2Sync(inputPassword, salt, iterations, keyLength, digest)
    .toString('hex');
  return hash === originalHash;
}
function issueJWT(user_id) {
  const expiresInSeconds = 24 * 60 * 60; // 1 day in seconds

  const payload = {
    sub: user_id,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
  };
  
  const signedToken = jwt.sign(payload, PRIV_KEY, { algorithm: 'RS256' });

  return signedToken;
}

async function optionalAuth(req, res, next) {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];

    jwt.verify(token, PUB_KEY, { algorithms: ['RS256'] }, async (err, payload) => {
      if (err) {
        return next();
      }
      
      const userId = payload.sub;
      const user = await db.getUserById(userId);
      if (!user) {
        return next();
      }
      req.user = user;
      return next();
    });
  } else {
    return next();
  }
}

export { getHashPassword, invalidatePassword, issueJWT, optionalAuth };
