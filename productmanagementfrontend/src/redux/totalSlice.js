// totalSlice.js

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  totalTVA: 0,
  totalDetailLine: 0,
};

const totalSlice = createSlice({
  name: 'total',
  initialState,
  reducers: {
    setTotalTVA: (state, action) => {
      state.totalTVA = action.payload;
    },
    setTotalDetailLine: (state, action) => {
      state.totalDetailLine = action.payload;
    },
  },
});

export const { setTotalTVA, setTotalDetailLine } = totalSlice.actions;

export default totalSlice.reducer;
