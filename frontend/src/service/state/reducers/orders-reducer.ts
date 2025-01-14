import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IOrder } from '../../../interfaces/Order/IOrder';
import CompareObjects from 'lodash/isEqual';

interface OrdersState {
  items: IOrder[];
  totalItems: number;
  loading: boolean;
  error: string | null;
}

export const ordersSlice = createSlice({
  name: 'orders',
  initialState: {
    items: [],
    totalItems: 0,
    loading: false,
    error: null,
  } as OrdersState,
  reducers: {
    setOrders: (
      state,
      action: PayloadAction<{ items: IOrder[]; totalItems: number }>,
    ) => {
      const { items, totalItems } = action.payload;
      if (CompareObjects(state.items, items) && state.totalItems === totalItems)
        return;
      state.items = items;
      state.totalItems = totalItems;
    },
    addOrder: (state, action: PayloadAction<IOrder>) => {
      state.items.push(action.payload);
      state.totalItems += 1;
    },
    updateOrder: (state, action: PayloadAction<IOrder>) => {
      const index = state.items.findIndex(
        (order) => order.orderId === action.payload.orderId,
      );
      if (index !== -1) {
        state.items[index] = { ...state.items[index], ...action.payload };
      }
    },
    removeOrder: (state, action: PayloadAction<number>) => {
      state.items = state.items.filter(
        (order) => order.orderId !== action.payload,
      );
      state.totalItems -= 1;
    },
    clearOrders: (state) => {
      state.items = [];
      state.totalItems = 0;
    },
  },
});

export const { setOrders, addOrder, updateOrder, removeOrder, clearOrders } =
  ordersSlice.actions;

export default ordersSlice.reducer;
