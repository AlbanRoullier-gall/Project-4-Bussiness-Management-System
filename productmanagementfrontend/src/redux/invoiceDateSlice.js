import { createSlice } from '@reduxjs/toolkit';

const invoiceDateSlice = createSlice({
  name: 'invoiceDate',
  initialState: {
    emissionDate: null, 
  },
  reducers: {
    setEmissionDate: (state, action) => {
      state.emissionDate = action.payload; 
    },
  },
});

export const { setEmissionDate } = invoiceDateSlice.actions;
export default invoiceDateSlice.reducer;
