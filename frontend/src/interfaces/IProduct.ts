import { ICategory } from './ICategory';
import { IImage } from './IImage';

export interface IProduct {
  id: number;
  sellerId: number;
  name: string;
  brand: string;
  currentPrice: number;
  originalPrice: number;
  description: string;
  soldCount: number;
  quantity: number;
  material: string;
  origin: string;
  colors: string[];
  sizes: string[];
  publishedAt: string;
  categories: ICategory[];
  images: IImage[];
}
