import { createSlice } from '@reduxjs/toolkit';
import { IOrder } from '../../../interfaces/Order/IOrder';
import CompareObjects from 'lodash/isEqual';

export const ordersSlice = createSlice({
  name: 'orders',
  initialState: {} as IOrder,
  reducers: {
    setOrder: (state, action) => {
      if (CompareObjects(state, action.payload)) return;
      return action.payload;
    },
  },
});

export const { setOrder } = ordersSlice.actions;
