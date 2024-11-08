import express from 'express';
const router = express.Router();

import productController from '../controllers/product.controller';
import passport from '../middlewares/authentication.middleware';
import Auth from '../middlewares/authorization.middleware';
import { Role } from '@prisma/client';
import { body, param } from 'express-validator';
import { handleValidationErrors } from '../core/validator';

router.post('/',
  passport.authenticate('jwt', { session: false }),
  Auth.authorize([Role.ADMIN]),
  body('name').isString().withMessage('Invalid name'),
  body('description').isString().withMessage('Invalid description'),
  handleValidationErrors,
  productController.createProductCategory
);

router.get('/',
  productController.getAllProductCategories
);

router.patch('/', 
  passport.authenticate('jwt', { session: false }),
  Auth.authorize([Role.ADMIN]),
  param('categoryId').isNumeric().withMessage('categoryId must be a number'),
  body('name').optional().isString().withMessage('Invalid name'),
  body('description').optional().isString().withMessage('Invalid description'),
  handleValidationErrors,
  productController.updateProductCategory
);

router.delete('/',
  passport.authenticate('jwt', { session: false }),
  Auth.authorize([Role.ADMIN]),
  param('categoryId').isNumeric().withMessage('categoryId must be a number'),
  handleValidationErrors,
  productController.deleteProductCategory
);


export default router;