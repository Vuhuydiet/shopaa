import { Request, Response } from "express";
import { matchedData } from "express-validator";
import ProductService, { ProductQueryParams } from "./product.service";
import { CreatedResponse, OKResponse } from "../../core/SuccessResponse";


export default {

  createProductCategory: async (req: Request, res: Response) => {
    const { name, description } = matchedData(req);
    await ProductService.createCategory({ name, description });
    new OKResponse({ message: 'Product category created successfully' }).send(res);
  },

  getAllProductCategories: async (_req: Request, res: Response) => {
    const categories = await ProductService.getAllCategories();
    new OKResponse({ message: 'Get categories successfully', metadata: categories }).send(res);
  },

  updateProductCategory: async (req: Request, res: Response) => {
    const { categoryId, name, description } = matchedData(req);
    await ProductService.updateCategory(+categoryId, { name, description });
    new OKResponse({ message: 'Product category updated successfully' }).send(res);
  },

  deleteProductCategory: async (req: Request, res: Response) => {
    const { categoryId } = matchedData(req);
    await ProductService.deleteCategory(+categoryId);

    new OKResponse({ message: 'Product category deleted successfully!' }).send(res);
  },









  createProduct: async (req: Request, res: Response) => {
    const { userId } = req.user as any;
    const { productData } = matchedData(req);
    const product = await ProductService.createProduct(userId, productData);
    new CreatedResponse({ message: 'Product created successfully!', metadata: { product } }).send(res);
  },

  getAllProducts: async (req: Request, res: Response) => {
    const params = matchedData(req) as ProductQueryParams;
    const products = await ProductService.getAllProducts(params);
    new OKResponse({ message: 'Get products successfully', metadata: { products } }).send(res);
  },

  getProductById: async (req: Request, res: Response) => {
    const { productId } = matchedData(req);
    const product = await ProductService.getProductById(+productId);
    new OKResponse({ message: 'Get product successflly', metadata: { product } }).send(res);
  },

  searchProducts: async (req: Request, res: Response) => {
    const params = matchedData(req) as ProductQueryParams & { keyword: string };
    const products = await ProductService.searchProducts(params.keyword, params);
    new OKResponse({ message: 'Search products successfully', metadata: { products } }).send(res);
  },

  updateProduct: async (req: Request, res: Response) => {
    const { productId, productData } = matchedData(req);
    await ProductService.updateProduct(+productId, productData);
    new OKResponse({ message: 'Product updated successfully' }).send(res);
  },

  incrementProductQuantity: async (req: Request, res: Response) => {
    const { productId, quantity } = matchedData(req);
    await ProductService.incrementProductQuantity(+productId, quantity);
    new OKResponse({ message: 'Product quantity incremented successfully' }).send(res);

  },

  deleteProduct: async (req: Request, res: Response) => {
    const { productId } = matchedData(req);
    await ProductService.deleteProduct(+productId);
    new OKResponse({ message: 'Product deleted successfully' }).send(res);
  },

}