import { configureStore } from '@reduxjs/toolkit';
import { productsSlice } from './slices/products-slice';
import { paginationSlice } from './slices/pagination-slice';
import { filterSlice } from './slices/filter-slice';
import { categorySlice } from './slices/category-slice';
import { productSlice } from './slices/product-slice';
import { ordersSlice } from './slices/orders-slice';
import { returnSlipSlice } from './slices/return-slice';

export const store = configureStore({
  reducer: {
    products: productsSlice.reducer,
    filters: filterSlice.reducer,
    pagination: paginationSlice.reducer,
    categories: categorySlice.reducer,
    product: productSlice.reducer,
    orders: ordersSlice.reducer,
    returnSlip: returnSlipSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
