import express from 'express';
const router = express.Router();

import passport from '../../libraries/auth/authentication.middleware';

router.post('/shop',
  passport.authenticate('jwt', { session: false }),
  
  
)

export default router;