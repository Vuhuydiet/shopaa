import express from 'express'
import userController from '../controllers/user.controller';
const router = express.Router();

router.get('/:userId', userController.getUserProfile);
router.patch('/', userController.updateUserProfile);
router.patch('/password', userController.updatePassword);
router.delete('/', userController.deleteUser);

export default router;