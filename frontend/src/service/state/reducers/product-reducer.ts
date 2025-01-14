import { createSlice } from '@reduxjs/toolkit';
import { IProduct } from '../../../interfaces/IProduct';
import CompareObjects from 'lodash/isEqual';

export const productSlice = createSlice({
  name: 'product',
  initialState: {} as IProduct,
  reducers: {
    setProduct: (state, action) => {
      if (CompareObjects(state, action.payload)) return;
      return action.payload;
    },
  },
});

export const { setProduct } = productSlice.actions;
