import express from 'express';
const router = express.Router();

import productController from './product.controller';
import passport from '../../libraries/auth/authentication.middleware';
import Auth from '../../libraries/auth/authorization.middleware';
import { Role } from '@prisma/client';
import { body, param } from 'express-validator';
import { handleValidationErrors } from '../../libraries/validator/validator';

const IdValidator = () => {
  return [
    param('categoryId').isNumeric().toInt(),
  ]
}

const dataValidator = () => {
  return [
    body('name')        .isString(),
    body('description') .isString(),
  ];
}

router.post('/',
  passport.authenticate('jwt', { session: false }),
  Auth.authorize([Role.ADMIN]),

  dataValidator(),
  handleValidationErrors,
  
  productController.createProductCategory
);

router.get('/',
  productController.getAllProductCategories
);

router.patch('/', 
  passport.authenticate('jwt', { session: false }),
  Auth.authorize([Role.ADMIN]),
  
  IdValidator(),
  dataValidator(),
  handleValidationErrors,
  
  productController.updateProductCategory
);

router.delete('/:categoryId',
  passport.authenticate('jwt', { session: false }),
  Auth.authorize([Role.ADMIN]),

  IdValidator(),
  handleValidationErrors,
  
  productController.deleteProductCategory
);


export default router;