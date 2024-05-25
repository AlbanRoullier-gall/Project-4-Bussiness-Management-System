import { createSlice } from '@reduxjs/toolkit';

const discountPercentageSlice = createSlice({
  name: 'discountPercentage',
  initialState: 0,
  reducers: {
    setDiscountPercentage(state, action) {
      return action.payload;
    },
  },
});

export const { setDiscountPercentage } = discountPercentageSlice.actions;
export default discountPercentageSlice.reducer;
