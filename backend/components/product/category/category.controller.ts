
import { OKResponse } from "../../../core/SuccessResponse";
import ProductService from "../product.service";
import { matchedData } from "express-validator";
import { Request, Response } from "express";

export default {
  
  createProductCategory: async (req: Request, res: Response) => {
    const { name, description } = matchedData(req);

    const newCat = await ProductService.createCategory({ name, description });

    new OKResponse({ message: 'Product category created successfully', metadata: { category: newCat } }).send(res);
  },

  getCategoryById: async (req: Request, res: Response) => {
    const { categoryId } = matchedData(req);

    const category = await ProductService.getCategoryById(categoryId);

    new OKResponse({ message: 'Get category successfully', metadata: { category } }).send(res);
  },

  getAllProductCategories: async (_req: Request, res: Response) => {
    const categories = await ProductService.getAllCategories();

    new OKResponse({ message: 'Get categories successfully', metadata: categories }).send(res);
  },

  updateProductCategory: async (req: Request, res: Response) => {
    const { categoryId, name, description } = matchedData(req);

    const cat = await ProductService.updateCategory(categoryId, { name, description });

    new OKResponse({ message: 'Product category updated successfully', metadata: { category: cat } }).send(res);
  },

  deleteProductCategory: async (req: Request, res: Response) => {
    const { categoryId } = matchedData(req);

    await ProductService.deleteCategory(categoryId);

    new OKResponse({ message: 'Product category deleted successfully!' }).send(res);
  },

}