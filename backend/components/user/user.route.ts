import express from 'express';
import userController from './user.controller';
import { body, param } from 'express-validator';
import { handleValidationErrors } from '../../libraries/validator/Validator';
import passport, {
  verifyTokenIfExists,
} from '../../libraries/auth/authentication.middleware';
import upload from '../../libraries/imageUploader/multer';
const router = express.Router();

const userIdValidator = () => {
  return [param('userId').isNumeric().toInt()];
};

const userProfileValidator = () => {
  return [
    body('profile')
      .isJSON()
      .customSanitizer(JSON.parse as any),
    body('profile.fullname').optional().isString(),
    body('profile.dateOfBirth').optional().isISO8601().toDate(),
    body('profile.gender').optional().isString(),
    body('profile.phoneNumber').optional().isMobilePhone('any'),
  ];
};

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

  upload.single('avatar'),
  userProfileValidator(),
  handleValidationErrors,

  userController.updateUserProfile,
);

router.delete(
  '/',
  passport.authenticate('jwt', { session: false }),

  userController.deleteUser,
);

export default router;
