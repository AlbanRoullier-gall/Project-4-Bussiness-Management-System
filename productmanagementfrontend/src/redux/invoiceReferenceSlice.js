import { createSlice } from '@reduxjs/toolkit';

const invoiceReferenceSlice = createSlice({
  name: 'invoiceReference',
  initialState: {
    reference: '', // La valeur initiale est une chaîne vide
  },
  reducers: {
    setInvoiceReference: (state, action) => {
      state.reference = action.payload; // Permet de définir la référence de la facture
    },
  },
});

export const { setInvoiceReference } = invoiceReferenceSlice.actions;
export default invoiceReferenceSlice.reducer;
