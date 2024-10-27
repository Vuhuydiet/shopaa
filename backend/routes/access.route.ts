import express from 'express';
import accessController from '../controllers/access.controller.js';
import passport from '../middlewares/auth.middleware.js';
const router = express.Router();

router.get('/otp', accessController.sendOtp);

router.post('/sign-up', accessController.signUp);

router.post('/sign-in', accessController.signIn);

router.post('/change-password', accessController.changePassword);

router.get('/auth/google', passport.authenticate('google', { scope: ['profile'] }));
router.get(
  '/auth/google/callback', 
  passport.authenticate('google', { session: false }), 
  accessController.signInWithOAuth,
);

router.get('/auth/facebook', passport.authenticate('facebook', { scope: ['public_profile'] }));
router.get(
  '/auth/facebook/callback', 
  passport.authenticate('facebook', { session: false }), 
  accessController.signInWithOAuth
);

export default router;