import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICategory } from '../../../interfaces/ICategory';

export const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    items: [] as ICategory[],
  },
  reducers: {
    setCategories: (state, action: PayloadAction<ICategory[]>) => {
      state.items = action.payload;
    },
  },
});

export const { setCategories } = categorySlice.actions;
