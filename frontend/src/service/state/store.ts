import { configureStore } from '@reduxjs/toolkit';
import { productSlice } from './slices/product-slice';
import { paginationSlice } from './slices/pagination-slice';
import { filterSlice } from './slices/filter-slice';
import { categorySlice } from './slices/category-slice';

export const store = configureStore({
  reducer: {
    products: productSlice.reducer,
    filters: filterSlice.reducer,
    pagination: paginationSlice.reducer,
    categories: categorySlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
