import { createSlice } from '@reduxjs/toolkit';
import { IFilterProduct } from '../../../interfaces/IFilterProduct';
import { PRODUCTS_FILTER } from '../../../config/constants';
import { IProduct } from '../../../interfaces/IProduct';
import { filterAsync } from '../actions/filter-action';

export const filterReducer = createSlice({
  name: 'filters',
  initialState: {
    filter: {
      keyword: undefined,
      shopId: undefined,
      category: undefined,
      brand: undefined,
      postedAfter: undefined,
      postedBefore: undefined,
      minPrice: undefined,
      maxPrice: undefined,
      minQuantity: undefined,
      maxQuantity: undefined,
      sortBy: 'publishedAt',
      order: 'desc',
      limit: PRODUCTS_FILTER.ITEMS_PER_PAGE,
      offset: 0,
    } as IFilterProduct,
    products: [] as IProduct[],
    isLoading: false,
    totalItems: 0 as number,
  },
  reducers: {
    resetInitialState: (state) => {
      state = {
        filter: {
          keyword: undefined,
          shopId: undefined,
          category: undefined,
          brand: undefined,
          postedAfter: undefined,
          postedBefore: undefined,
          minPrice: undefined,
          maxPrice: undefined,
          minQuantity: undefined,
          maxQuantity: undefined,
          sortBy: 'publishedAt',
          order: 'desc',
          limit: PRODUCTS_FILTER.ITEMS_PER_PAGE,
          offset: 0,
        },
        products: [],
        isLoading: false,
        totalItems: 0,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(filterAsync.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(filterAsync.fulfilled, (state, action) => {
      state.isLoading = false;
      state.products = action?.payload?.products;
      state.totalItems = action?.payload?.totalItems;

      const filter = action?.payload?.filter || {};
      (Object.keys(filter) as (keyof IFilterProduct)[]).forEach((key) => {
        const filterValue = filter[key];

        if (filterValue !== undefined && filterValue !== state.filter[key]) {
          if (key in state.filter) {
            state.filter[key] = filterValue as never;
          }
        }
      });
    });

    builder.addCase(filterAsync.rejected, (state) => {
      state.isLoading = false;
    });
  },
});

export const { resetInitialState } = filterReducer.actions;
