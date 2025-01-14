import express from 'express';
import accessController from './access.controller';
import passport from './auth/authentication.middleware';
import { handleValidationErrors } from '../../libraries/validator/validator';
import { body } from 'express-validator';
const router = express.Router();

router.post(
  '/send-otp',
  body('email').notEmpty().isEmail().withMessage('Invalid email'),
  handleValidationErrors,
  accessController.sendOtp,
);

router.post(
  '/forgot-password',
  body('email').notEmpty().isEmail().withMessage('Invalid email'),
  body('otp').notEmpty().isInt().withMessage('Invalid OTP'),
  body('newPassword').notEmpty().isString().withMessage('Invalid new password'),
  handleValidationErrors,
  accessController.forgotPassword,
);

router.post(
  '/sign-up',
  body('username')
    .notEmpty()
    .withMessage('Username is required')
    .isString()
    .withMessage('Invalid username'),
  body('password').notEmpty().isString().withMessage('Invalid password'),
  body('email').notEmpty().isEmail().withMessage('Invalid email'),
  body('otp').notEmpty().isInt().withMessage('Invalid OTP'),
  handleValidationErrors,
  accessController.signUp,
);

router.post(
  '/sign-in',
  body('username').notEmpty().isString().withMessage('Invalid username'),
  body('password').notEmpty().isString().withMessage('Invalid password'),
  handleValidationErrors,
  accessController.signIn,
);

router.get(
  '/account',
  passport.authenticate('jwt', { session: false }),
  accessController.getAccount,
);

router.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile'] }),
);
router.get(
  '/auth/google/callback',
  passport.authenticate('google', { session: false }),
  accessController.signInWithOAuth,
);

router.get(
  '/auth/facebook',
  passport.authenticate('facebook', { scope: ['public_profile'] }),
);
router.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', { session: false }),
  accessController.signInWithOAuth,
);

router.post(
  '/change-password',
  passport.authenticate('jwt', { session: false }),
  body('oldPassword').isString().withMessage('Invalid old password'),
  body('newPassword').notEmpty().isString().withMessage('Invalid new password'),
  handleValidationErrors,
  accessController.changePassword,
);

export default router;
