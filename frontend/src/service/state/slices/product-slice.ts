import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IProduct } from '../../../interfaces/IProduct';
import { serializeDate } from '../../../utils/date-convert';
import { IImage } from '../../../interfaces/IImage';
import CompareObjects from 'lodash/isEqual';

interface IProductState {
  items: IProduct[];
  loading: boolean;
  error: string | null;
}

export const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    loading: false,
    error: null,
  } as IProductState,
  reducers: {
    setProducts: (state, action: PayloadAction<IProduct[]>) => {
      const res = action.payload.map((product) => ({
        ...product,
        images: product.images.map((image: IImage) => ({
          ...image,
          createdAt:
            image.createdAt instanceof Date
              ? serializeDate(image.createdAt)
              : image.createdAt,
        })),
        publishedAt:
          product.publishedAt instanceof Date
            ? serializeDate(product.publishedAt)
            : product.publishedAt,
      }));

      if (CompareObjects(state.items, res)) return;
      state.items = res;
    },
  },
});

export const { setProducts } = productSlice.actions;
