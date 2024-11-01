import express from 'express'

import Auth from '../middlewares/authorization.middleware';
import { Role } from '@prisma/client';
import shopController from '../controllers/shop.controller';

const router = express.Router();

router.get('/:shopId', )

router.post('/register', Auth.authorize([Role.USER], 'Only user can register a shop'), shopController.registerShop)


export default router;