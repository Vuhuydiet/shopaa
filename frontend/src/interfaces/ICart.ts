import { IShop } from './IShop';

interface IProduct {
  id: number;
  name: string;
  currentPrice: number;
  imageUrl: string;
  currentColor: string;
  currentSize: string;
  colors: string[];
  sizes: string[];
}

export interface ICart {
  shop: IShop;
  products: IProduct[];
}
