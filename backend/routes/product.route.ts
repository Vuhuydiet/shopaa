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
  Auth.authorize([Role.SHOP_MANAGER]),
  body('productData')                       .isObject(),
  body('productData.name')                  .isString(),
  body('product.price')                     .isNumeric(),
  body('product.quantity')      .optional() .isNumeric(),
  body('product.description')   .optional() .isString(),
  body('product.brand')         .optional() .isString(),
  body('product.categories')    .optional() .isArray(),
  body('product.categories.*')  .optional() .isNumeric(),
  body('product.images')        .optional() .isArray(),
  body('product.images.*')      .optional() .isString(),
  handleValidationErrors,
  productController.createProduct
);

router.get('/',
  productController.getAllProducts
);

router.get('/:productId',
  param('productId').isNumeric(),
  handleValidationErrors,
  productController.getProductById
);

router.get('/search',
  param('keyword').isString(),
  handleValidationErrors,
  productController.searchProducts
);

router.patch('/:productId',
  passport.authenticate('jwt', { session: false }),
  Auth.authorize([Role.SHOP_MANAGER]),
  param('productId')                          .isNumeric(),
  body('productData')                         .isObject(),
  body('productData.name')        .optional() .isString(),
  body('productData.price')       .optional() .isNumeric(),
  body('productData.quantity')    .optional() .isNumeric(),
  body('productData.brand')       .optional() .isString(),
  body('productData.quantity')    .optional() .isNumeric(),
  body('productData.description') .optional() .isString(),
  handleValidationErrors,
  productController.updateProduct
);

router.patch('/:productId/quantity',
  passport.authenticate('jwt', { session: false }),
  Auth.authorize([Role.SHOP_MANAGER]),
  param('productId').isNumeric(),
  body('quantity').isNumeric(),
  handleValidationErrors,
  productController.incrementProductQuantity
);

router.delete('/:productId',
  passport.authenticate('jwt', { session: false }),
  Auth.authorize([Role.SHOP_MANAGER]),
  param('productId').isNumeric(),
  handleValidationErrors,
  productController.deleteProduct
);

export default router;