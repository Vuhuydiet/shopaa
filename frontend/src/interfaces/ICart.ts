import { IShop } from './IShop';

interface IProduct {
  key: number;
  id: number;
  name: string;
  currentPrice: number;
  originalPrice: number;
  imageUrl: string;
  color: string;
  size: string;
  colors: string[];
  sizes: string[];
}

export interface ICart {
  shop: IShop;
  products: IProduct[];
}
