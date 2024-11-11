import express from 'express';
import userController from './user.controller';
import { body, param } from 'express-validator';
import { handleValidationErrors } from '../../core/Validator';
import passport, {
  verifyTokenIfExists,
} from '../../libraries/auth/authentication.middleware';
const router = express.Router();

router.get(
  '/:userId',
  verifyTokenIfExists,
  param('userId')
    .notEmpty()
    .withMessage('User ID is required')
    .isInt()
    .withMessage('User ID must be a number'),
  handleValidationErrors,
  userController.getUserProfile,
);

router.patch(
  '/',
  passport.authenticate('jwt', { session: false }),
  body('profile').notEmpty().withMessage('Profile data is required'),
  handleValidationErrors,
  userController.updateUserProfile,
);

router.delete(
  '/',
  passport.authenticate('jwt', { session: false }),
  userController.deleteUser,
);

export default router;
