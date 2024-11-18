import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ICategory } from '../../../interfaces/ICategory';
import CompareObject from 'lodash/isEqual';

export const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    items: [] as ICategory[],
  },
  reducers: {
    setCategories: (state, action: PayloadAction<ICategory[]>) => {
      if (CompareObject(state.items, action.payload)) return;
      state.items = action.payload;
    },
  },
});

export const { setCategories } = categorySlice.actions;
