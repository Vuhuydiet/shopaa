import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IFilterProduct } from '../../../interfaces/IFilterProduct';

export const filterSlice = createSlice({
  name: 'filters',
  initialState: {
    limit: 24,
  } as IFilterProduct,
  reducers: {
    setFilter: (state, action: PayloadAction<IFilterProduct>) => {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
});

export const { setFilter } = filterSlice.actions;
