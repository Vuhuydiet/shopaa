import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IProduct } from '../../../interfaces/IProduct';
import { IImage } from '../../../interfaces/IImage';
import CompareObjects from 'lodash/isEqual';

interface IProductState {
  items: IProduct[];
  totalItems: number;
  loading: boolean;
  error: string | null;
}

export const productsSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    totalItems: 0,
    loading: false,
    error: null,
  } as IProductState,
  reducers: {
    setProducts: (
      state,
      action: PayloadAction<{ items: IProduct[]; totalItems: number }>,
    ) => {
      const res = action.payload.items.map((product) => ({
        ...product,
        images: product.images.map((image: IImage) => ({
          ...image,
          createdAt: image.createdAt,
        })),
        publishedAt: product.publishedAt,
      }));

      if (
        CompareObjects(state.items, res) &&
        state.totalItems === action.payload.totalItems
      )
        return;
      state.items = res;
      state.totalItems = action.payload.totalItems;
    },
  },
});

export const { setProducts } = productsSlice.actions;
