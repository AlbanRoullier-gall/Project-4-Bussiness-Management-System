import { createSlice } from '@reduxjs/toolkit';

export const invoiceItemsSlice = createSlice({
  name: 'invoiceItems',
  initialState: [],
  reducers: {
    setInvoiceItems: (state, action) => {
      return action.payload;
    },
  },
});

export const { setInvoiceItems } = invoiceItemsSlice.actions;

export default invoiceItemsSlice.reducer;
