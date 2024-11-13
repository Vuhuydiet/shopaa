import express from 'express';
const router = express.Router();

import productController from './product.controller';
import passport from '../../libraries/auth/authentication.middleware';
import Auth from '../../libraries/auth/authorization.middleware';
import { Role } from '@prisma/client';
import { body, param, query } from 'express-validator';
import { handleValidationErrors } from '../../libraries/validator/Validator';
import upload from '../../libraries/imageUploader/multer';


const productIdValidator = () => {
  return [
    param('productId').isNumeric().toInt(),
  ];
}

const productDataValidator = (post: boolean) => {
  return [
    body('productData')                                 .isJSON()   .customSanitizer(JSON.parse as any),
    body('productData.name')                .if(() => post).isString(),
    body('productData.price')               .if(() => post).isNumeric(),
    body('productData.quantity')            .optional().isNumeric(),
    body('productData.brand')               .optional() .isString(),
    body('productData.description')         .optional() .isString(),
    body('productData.categories')          .optional() .isObject(),
    body('productData.categories.add')      .optional() .isArray(),
    body('productData.categories.add.*')    .optional() .isNumeric(),
    body('productData.categories.remove')   .optional() .isArray(),
    body('productData.categories.remove.*') .optional() .isNumeric(),
    body('productData.images')              .optional() .isObject(),
    body('productData.images.remove')       .optional() .isArray(),
    body('productData.images.remove.*')     .optional() .isString(),
  ];
}

const queryValidator = () => {
  return [
    query('shopId')        .optional() .isNumeric().toInt(),
    query('category')      .optional() .isNumeric().toInt(),
    query('brand')         .optional() .isString(),
    query('postedAfter')   .optional() .isISO8601().toDate(),
    query('postedBefore')  .optional() .isISO8601().toDate(),
    query('minPrice')      .optional() .isNumeric().toFloat(),
    query('maxPrice')      .optional() .isNumeric().toFloat(),
    query('minQuantity')   .optional() .isNumeric().toInt(),
    query('maxQuantity')   .optional() .isNumeric().toInt(),
    query('sortBy')        .optional() .isString(),
    query('order')         .optional() .isString(),
    query('offset')        .optional() .isNumeric().toInt(),
    query('limit')         .optional() .isNumeric().toInt(),
  ];
}

const keywordQueryValidator = () => {
  return [
    query('keyword').isString(),
  ];
}


router.post('/',
  passport.authenticate('jwt', { session: false }),
  Auth.authorize([Role.SHOP_MANAGER]),

  upload.array('images'),

  productDataValidator(true),
  handleValidationErrors,

  productController.createProduct
);

router.get('/',
  queryValidator(),
  handleValidationErrors,

  productController.getAllProducts
);

router.get('/:productId',
  productIdValidator(),
  handleValidationErrors,

  productController.getProductById
);

router.get('/search',
  keywordQueryValidator(),
  queryValidator(), 
  handleValidationErrors,

  productController.searchProducts
);

router.patch('/:productId',
  passport.authenticate('jwt', { session: false }),
  Auth.authorize([Role.SHOP_MANAGER]),
  
  upload.array('images'),
  productIdValidator(),
  productDataValidator(false),
  handleValidationErrors,
  
  productController.updateProduct
);

router.patch('/:productId/quantity',
  passport.authenticate('jwt', { session: false }),
  Auth.authorize([Role.SHOP_MANAGER]),

  productIdValidator(),
  handleValidationErrors,

  productController.incrementProductQuantity
);

router.delete('/:productId',
  passport.authenticate('jwt', { session: false }),
  Auth.authorize([Role.SHOP_MANAGER]),

  productIdValidator(),
  handleValidationErrors,
  
  productController.deleteProduct
);

export default router;