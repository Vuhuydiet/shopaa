import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IFilterProduct } from '../../../interfaces/IFilterProduct';
import CompareObject from 'lodash/isEqual';
import { PRODUCTS_FILTER } from '../../../config/constants';

export const filterSlice = createSlice({
  name: 'filters',
  initialState: {
    limit: PRODUCTS_FILTER.ITEMS_PER_PAGE,
  } as IFilterProduct,
  reducers: {
    setFilter: (state, action: PayloadAction<IFilterProduct>) => {
      const res = { ...state, ...action.payload };
      if (CompareObject(state, res)) return;
      return res;
    },
  },
});

export const { setFilter } = filterSlice.actions;
