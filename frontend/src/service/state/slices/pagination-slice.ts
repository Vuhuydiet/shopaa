import { createSlice } from '@reduxjs/toolkit';
import { IPagination } from '../../../interfaces/IPagination';
import CompareObjects from 'lodash/isEqual';

export const paginationSlice = createSlice({
  name: 'pagination',
  initialState: {
    currentPage: 1,
    itemsPerPage: 24,
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
