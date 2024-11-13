import { Request, Response } from "express";
import { matchedData } from "express-validator";
import ProductService, { ProductQueryParams } from "./product.service";
import { CreatedResponse, OKResponse } from "../../core/SuccessResponse";


export default {

  createProductCategory: async (req: Request, res: Response) => {
    const { name, description } = matchedData(req);

    const newCat = await ProductService.createCategory({ name, description });

    new OKResponse({ message: 'Product category created successfully', metadata: { category: newCat } }).send(res);
  },

  getAllProductCategories: async (_req: Request, res: Response) => {
    const categories = await ProductService.getAllCategories();

    new OKResponse({ message: 'Get categories successfully', metadata: categories }).send(res);
  },

  updateProductCategory: async (req: Request, res: Response) => {
    const { categoryId, name, description } = matchedData(req);

    const cat = await ProductService.updateCategory(+categoryId, { name, description });

    new OKResponse({ message: 'Product category updated successfully', metadata: { category: cat } }).send(res);
  },

  deleteProductCategory: async (req: Request, res: Response) => {
    const { categoryId } = matchedData(req);

    await ProductService.deleteCategory(+categoryId);

    new OKResponse({ message: 'Product category deleted successfully!' }).send(res);
  },









  createProduct: async (req: Request, res: Response) => {
    const { userId } = req.user as any;
    const { productData } = req.body;
    productData.images = req.files as Express.Multer.File[];

    const product = await ProductService.createProduct(userId, productData);

    new CreatedResponse({ message: 'Product created successfully!', metadata: { product } }).send(res);
  },

  getAllProducts: async (req: Request, res: Response) => {
    const { shopId, category, brand, postedAfter, postedBefore, minPrice, maxPrice, minQuantity, maxQuantity, sortBy, order, offset, limit } = req.query;

    const products = await ProductService.getAllProducts({
      shopId: shopId ? +shopId : undefined,
      category: category ? +category : undefined,
      brand: brand as any,
      postedAfter: postedAfter ? new Date(postedAfter as string) : undefined,
      postedBefore: postedBefore ? new Date(postedBefore as string) : undefined,
      minPrice: minPrice ? +minPrice : undefined,
      maxPrice: maxPrice ? +maxPrice : undefined,
      minQuantity: minQuantity ? +minQuantity : undefined,
      maxQuantity: maxQuantity ? +maxQuantity : undefined,
      sortBy: sortBy as any,
      order: order as any,
      offset: offset ? +offset : undefined,
      limit: limit ? +limit : undefined
    });

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
    const { productId } = matchedData(req);
    const productData = req.body.productData;
    productData.images.add = req.files as Express.Multer.File[];

    const product = await ProductService.updateProduct(+productId, productData);

    new OKResponse({ message: 'Product updated successfully', metadata: { product } }).send(res);
  },

  incrementProductQuantity: async (req: Request, res: Response) => {
    const { productId, quantity } = matchedData(req);
    
    const newQuanity = await ProductService.incrementProductQuantity(+productId, quantity);
    
    new OKResponse({ message: 'Product quantity incremented successfully', metadata: { newQuanity } }).send(res);
  },

  deleteProduct: async (req: Request, res: Response) => {
    const { productId } = matchedData(req);
    
    await ProductService.deleteProduct(+productId);
    
    new OKResponse({ message: 'Product deleted successfully' }).send(res);
  },

}