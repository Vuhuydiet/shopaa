import { createAsyncThunk } from '@reduxjs/toolkit';
import { IFilterProduct } from '../../../interfaces/IFilterProduct';
import getProductsByFilter from '../../api/get-products';

export const KEY_FILTER_ACTION = 'filter';

export const filterAsync = createAsyncThunk(
  `${KEY_FILTER_ACTION}/getProducts`,
  async (filter: IFilterProduct, { rejectWithValue }) => {
    try {
      const response = await getProductsByFilter(filter);

      return {
        products: response?.items,
        totalItems: response?.count,
        filter: filter,
      };
    } catch (error) {
      throw rejectWithValue(error);
    }
  },
);
