import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IPagination } from '../../../interfaces/IPagination';

export const paginationSlice = createSlice({
  name: 'pagination',
  initialState: {
    currentPage: 1,
    itemsPerPage: 24,
    totalItems: 0,
  } as IPagination,
  reducers: {
    setPagination: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setPagination } = paginationSlice.actions;
