import { configureStore } from '@reduxjs/toolkit';
import { productsSlice } from './reducers/products-reducer';
import { paginationSlice } from './reducers/pagination-reducer';
import { filterReducer } from './reducers/filter-reducer';
import { categorySlice } from './reducers/category-reducer';
import { productSlice } from './reducers/product-reducer';
import { ordersSlice } from './reducers/orders-reducer';
import { returnSlipSlice } from './reducers/return-reducer';

export const store = configureStore({
  reducer: {
    products: productsSlice.reducer,
    filters: filterReducer.reducer,
    pagination: paginationSlice.reducer,
    categories: categorySlice.reducer,
    product: productSlice.reducer,
    orders: ordersSlice.reducer,
    returnSlip: returnSlipSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
