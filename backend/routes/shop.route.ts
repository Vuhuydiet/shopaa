import express from 'express'

import Auth from '../middlewares/authorization.middleware';
import { Role } from '@prisma/client';
import shopController from '../controllers/shop.controller';

const router = express.Router();

router.get('/:shopId', shopController.getShop);

router.post('/register', Auth.authorize([Role.USER], 'Only user can register a shop'), shopController.registerShop);

router.patch('/', Auth.authorize([Role.SHOP_MANAGER], 'Only shop manager can update their shop'), shopController.updateShop);

router.delete('/', Auth.authorize([Role.SHOP_MANAGER, Role.ADMIN], 'Only shop manager can delete their shop'), shopController.deleteShop);

export default router;