import { Request, Response } from "express";
import { matchedData } from "express-validator";
import ProductService from "./product.service";
import { CreatedResponse, OKResponse } from "../../core/SuccessResponse";


export default {

  createProduct: async (req: Request, res: Response) => {
    const { userId } = req.user as any;
    const { productData } = matchedData(req);
    productData.images = { add: req.files as Express.Multer.File[] };
    const product = await ProductService.createProduct(userId, productData);

    new CreatedResponse({
      message: 'Product created successfully!',
      metadata: { product },
    }).send(res);
  },

  getAllProducts: async (req: Request, res: Response) => {
    const query = matchedData(req) as any;

    const { count, products } = await ProductService.getAllProducts(query);

    new OKResponse({
      message: 'Get products successfully',
      metadata: { count, products },
    }).send(res);
  },

  getProductById: async (req: Request, res: Response) => {
    const { productId } = matchedData(req);

    const product = await ProductService.getProductById(productId);

    new OKResponse({
      message: 'Get product successflly',
      metadata: { product },
    }).send(res);
  },

  searchProducts: async (req: Request, res: Response) => {
    const params = matchedData(req);

    const { count, products } = await ProductService.searchProducts(params);

    new OKResponse({
      message: 'Search products successfully',
      metadata: { count, products },
    }).send(res);
  },

  updateProduct: async (req: Request, res: Response) => {
    const { productId, productData } = matchedData(req);
    productData.images = {
      ...productData.images,
      add: req.files as Express.Multer.File[],
    };

    const product = await ProductService.updateProduct(productId, productData);

    new OKResponse({
      message: 'Product updated successfully',
      metadata: { product },
    }).send(res);
  },

  incrementProductQuantity: async (req: Request, res: Response) => {
    const { productId, quantity } = matchedData(req);

    const newQuanity = await ProductService.incrementProductQuantity(
      productId,
      quantity,
    );

    new OKResponse({
      message: 'Product quantity incremented successfully',
      metadata: { newQuanity },
    }).send(res);
  },

  deleteProduct: async (req: Request, res: Response) => {
    const { productId } = matchedData(req);

    await ProductService.deleteProduct(productId);

    new OKResponse({ message: 'Product deleted successfully' }).send(res);
  },
};
