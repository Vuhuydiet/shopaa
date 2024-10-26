import express from 'express';
import accessController from '../controllers/access.controller.js';
import passport from '../middlewares/auth.middleware.js';
const router = express.Router();


/**
 * @swagger
 * /sign-up:
 *   post:
 *     summary: Sign up a new user
 *     tags: [Auth]
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
 *       201:
 *         description: User signed up successfully
 *       400:
 *         description: Bad request
 */
router.post('/sign-up', accessController.signUp);


/**
 * @swagger
 * /sign-in:
 *   post:
 *     summary: Sign in an existing user
 *     tags: [Auth]
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
 *         description: Wrong username or password
 */
router.post('/sign-in', accessController.signIn);

/**
 * @swagger
 * /auth/google:
 *   get:
 *     summary: Initiate Google OAuth
 *     tags: [Auth]
 *     responses:
 *       302:
 *         description: Redirect to Google OAuth
 */
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