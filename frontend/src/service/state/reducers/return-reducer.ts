import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IReturnSlip } from '../../../interfaces/Order/IReturnSlip';

interface ReturnSlipState {
  returnSlips: IReturnSlip[];
  totalItems: number;
  loading: boolean;
  error: string | null;
}

export const returnSlipSlice = createSlice({
  name: 'returnSlip',
  initialState: {
    returnSlips: [],
    totalItems: 0,
    loading: false,
    error: null,
  } as ReturnSlipState,
  reducers: {
    setReturnSlips: (
      state,
      action: PayloadAction<{ returnSlips: IReturnSlip[]; totalItems: number }>,
    ) => {
      const { returnSlips, totalItems } = action.payload;
      state.returnSlips = returnSlips;
      state.totalItems = totalItems;
    },
    addReturnSlip: (state, action: PayloadAction<IReturnSlip>) => {
      state.returnSlips.push(action.payload);
      state.totalItems += 1;
    },
    updateReturnSlip: (state, action: PayloadAction<IReturnSlip>) => {
      const index = state.returnSlips.findIndex(
        (returnSlip) => returnSlip.returnId === action.payload.returnId,
      );
      if (index !== -1) {
        state.returnSlips[index] = {
          ...state.returnSlips[index],
          ...action.payload,
        };
      }
    },
    removeReturnSlip: (state, action: PayloadAction<number>) => {
      state.returnSlips = state.returnSlips.filter(
        (returnSlip) => returnSlip.returnId !== action.payload,
      );
      state.totalItems -= 1;
    },
    clearReturnSlips: (state) => {
      state.returnSlips = [];
      state.totalItems = 0;
    },
  },
});

export const {
  setReturnSlips,
  addReturnSlip,
  updateReturnSlip,
  removeReturnSlip,
  clearReturnSlips,
} = returnSlipSlice.actions;

export default returnSlipSlice.reducer;
