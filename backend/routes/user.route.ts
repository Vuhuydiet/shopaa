import express from 'express';
import userController from '../controllers/user.controller';
import { body, param } from 'express-validator';
import { handleValidationErrors } from '../core/validator';
const router = express.Router();

/**
 * @swagger
 * /:userId:
 *   get:
 *     summary: Get user profile
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         description: The user ID
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       400:
 *         description: Invalid user ID
 *       404:
 *         description: User not found
 */

/**
 * @swagger
 * /:
 *   patch:
 *     summary: Update user profile
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               profile:
 *                 type: object
 *                 description: Profile data
 *     responses:
 *       200:
 *         description: User profile updated successfully
 *       400:
 *         description: Invalid profile data
 */

/**
 * @swagger
 * /:
 *   delete:
 *     summary: Delete user
 *     responses:
 *       200:
 *         description: User deleted successfully
 *       404:
 *         description: User not found
 */

router.get(
  '/:userId',
  param('userId')
    .notEmpty().withMessage('User ID is required')
    .isInt().withMessage('User ID must be a number'),
  handleValidationErrors,
  userController.getUserProfile
);

router.patch(
  '/',
  body('profile').notEmpty().withMessage('Profile data is required'),
  handleValidationErrors,
  userController.updateUserProfile
);

router.delete(
  '/',
  userController.deleteUser
);

export default router;