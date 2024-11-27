import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IFilterProduct } from '../../../interfaces/IFilterProduct';
import CompareObject from 'lodash/isEqual';

export const filterSlice = createSlice({
  name: 'filters',
  initialState: {
    limit: 12,
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
