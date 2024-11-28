import { createSlice } from '@reduxjs/toolkit';
import { IPagination } from '../../../interfaces/IPagination';
import CompareObjects from 'lodash/isEqual';
import { PRODUCTS_FILTER } from '../../../config/constants';

export const paginationSlice = createSlice({
  name: 'pagination',
  initialState: {
    currentPage: 1,
    itemsPerPage: PRODUCTS_FILTER.ITEMS_PER_PAGE,
    totalItems: 0,
  } as IPagination,
  reducers: {
    setPagination: (state, action) => {
      const res = { ...state, ...action.payload };
      if (CompareObjects(state, res)) return;
      return res;
    },
  },
});

export const { setPagination } = paginationSlice.actions;
