import express from 'express';
import accessController from '../controllers/access.controller.js';
import passport from '../middlewares/authenticate.middleware.js';
import { handleValidationErrors } from '../core/validator.js';
import { body } from 'express-validator';
const router = express.Router();

/**
 * @swagger
 * /otp:
 *   get:
 *     summary: Send OTP to email
 *     tags: [Access]
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: Email address to send OTP
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: Invalid email
 */

/**
 * @swagger
 * /sign-up:
 *   post:
 *     summary: Sign up a new user
 *     tags: [Access]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *               email:
 *                 type: string
 *               otp:
 *                 type: integer
 *     responses:
 *       201:
 *         description: User signed up successfully
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /sign-in:
 *   post:
 *     summary: Sign in a user
 *     tags: [Access]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: User signed in successfully
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /change-password:
 *   post:
 *     summary: Change user password
 *     tags: [Access]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               otp:
 *                 type: integer
 *               oldPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Invalid input
 */

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Authenticate with Google
 *     tags: [Access]
 *     responses:
 *       302:
 *         description: Redirect to Google for authentication
 */

/**
 * @swagger
 * /auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags: [Access]
 *     responses:
 *       200:
 *         description: User authenticated with Google
 *       401:
 *         description: Authentication failed
 */

/**
 * @swagger
 * /auth/facebook:
 *   get:
 *     summary: Authenticate with Facebook
 *     tags: [Access]
 *     responses:
 *       302:
 *         description: Redirect to Facebook for authentication
 */

/**
 * @swagger
 * /auth/facebook/callback:
 *   get:
 *     summary: Facebook OAuth callback
 *     tags: [Access]
 *     responses:
 *       200:
 *         description: User authenticated with Facebook
 *       401:
 *         description: Authentication failed
 */

router.get('/otp',
  body('email').notEmpty().isEmail().withMessage('Invalid email'),
  handleValidationErrors,
  accessController.sendOtp);

router.post('/sign-up', 
  body('username').notEmpty().withMessage('Username is required').isString().withMessage('Invalid username'),
  body('password').notEmpty().isString().withMessage('Invalid password'),
  body('email').notEmpty().isEmail().withMessage('Invalid email'),
  body('otp').notEmpty().isInt().withMessage('Invalid OTP'),
  handleValidationErrors,
  accessController.signUp);

router.post('/sign-in', 
  body('username').notEmpty().isString().withMessage('Invalid username'),
  body('password').notEmpty().isString().withMessage('Invalid password'),
  handleValidationErrors,
  accessController.signIn);

router.post('/change-password', 
  body('otp').isInt().withMessage('Invalid OTP'),
  body('oldPassword').isString().withMessage('Invalid old password'),
  body('newPassword').notEmpty().isString().withMessage('Invalid new password'),
  handleValidationErrors,
  accessController.changePassword);

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