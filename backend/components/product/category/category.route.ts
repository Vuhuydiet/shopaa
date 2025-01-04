import express from 'express';
const router = express.Router();

import categoryController from './category.controller';
import passport from '../../access/auth/authentication.middleware';
import Auth from '../../access/auth/authorization.middleware';
import { Role } from '@prisma/client';
import { body, param } from 'express-validator';
import { handleValidationErrors } from '../../../libraries/validator/validator';

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
  
  categoryController.createProductCategory
);

router.get('/',
  categoryController.getAllProductCategories
);

router.patch('/', 
  passport.authenticate('jwt', { session: false }),
  Auth.authorize([Role.ADMIN]),
  
  IdValidator(),
  dataValidator(),
  handleValidationErrors,
  
  categoryController.updateProductCategory
);

router.delete('/:categoryId',
  passport.authenticate('jwt', { session: false }),
  Auth.authorize([Role.ADMIN]),

  IdValidator(),
  handleValidationErrors,
  
  categoryController.deleteProductCategory
);


export default router;