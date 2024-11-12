import express from 'express';
const router = express.Router();

import productController from './product.controller';
import passport from '../../libraries/auth/authentication.middleware';
import Auth from '../../libraries/auth/authorization.middleware';
import { Role } from '@prisma/client';
import { body, param, query } from 'express-validator';
import { handleValidationErrors } from '../../core/Validator';
import upload from '../../libraries/memory/multer';
import BodyParser from '../../libraries/parser/parser.middleware';

router.post('/',
  passport.authenticate('jwt', { session: false }),
  Auth.authorize([Role.SHOP_MANAGER]),
  upload.array('images'),
  BodyParser.parseObject('productData'),
  body('productData')                           .isObject(),
  body('productData.name')                      .isString(),
  body('productData.price')                     .isNumeric(),
  body('productData.quantity')      .optional() .isNumeric(),
  body('productData.description')   .optional() .isString(),
  body('productData.brand')         .optional() .isString(),
  body('productData.categories')    .optional() .isArray(),
  body('productData.categories.*')  .optional() .isNumeric(),
  handleValidationErrors,
  productController.createProduct
);

router.get('/',
  query('shopId').optional().isNumeric(),
  query('category').optional().isNumeric(),
  query('brand').optional().isString(),
  query('postedAfter').optional().isDate(),
  query('postedBefore').optional().isDate(),
  query('minPrice').optional().isNumeric(),
  query('maxPrice').optional().isNumeric(),
  query('minQuantity').optional().isNumeric(),
  query('maxQuantity').optional().isNumeric(),
  query('sortBy').optional().isString(),
  query('order').optional().isString(),
  query('offset').optional().isNumeric(),
  query('limit').optional().isNumeric(),  
  handleValidationErrors,
  productController.getAllProducts
);

router.get('/:productId',
  param('productId').isNumeric(),
  handleValidationErrors,
  productController.getProductById
);

router.get('/search',
  query('keyword').isString(),
  query('shopId').optional().isNumeric(),
  query('category').optional().isNumeric(),
  query('brand').optional().isString(),
  query('postedAfter').optional().isDate(),
  query('postedBefore').optional().isDate(),
  query('minPrice').optional().isNumeric(),
  query('maxPrice').optional().isNumeric(),
  query('minQuantity').optional().isNumeric(),
  query('maxQuantity').optional().isNumeric(),
  query('sortBy').optional().isString(),
  query('order').optional().isString(),
  query('offset').optional().isNumeric(),
  query('limit').optional().isNumeric(),  
  handleValidationErrors,
  productController.searchProducts
);

router.patch('/:productId',
  passport.authenticate('jwt', { session: false }),
  Auth.authorize([Role.SHOP_MANAGER]),
  param('productId')                          .isNumeric(),
  body('*.productData')                         .isObject(),
  body('*.productData.name')        .optional() .isString(),
  body('*.productData.price')       .optional() .isNumeric(),
  body('*.productData.quantity')    .optional() .isNumeric(),
  body('*.productData.brand')       .optional() .isString(),
  body('*.productData.quantity')    .optional() .isNumeric(),
  body('*.productData.description') .optional() .isString(),
  body('*.productData.categories')  .optional() .isObject(),
  body('*.productData.categories.add').optional().isArray(),
  body('*.productData.categories.add.*').optional().isNumeric(),
  body('*.productData.categories.remove').optional().isArray(),
  body('*.productData.categories.remove.*').optional().isNumeric(),
  body('*.productData.images').optional().isObject(),
  body('*.productData.images.remove').optional().isArray(),
  body('*.productData.images.remove.*').optional().isString(),
  handleValidationErrors,
  upload.array('images'),
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