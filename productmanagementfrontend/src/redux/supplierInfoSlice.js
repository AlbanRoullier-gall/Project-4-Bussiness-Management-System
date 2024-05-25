// supplierInfoSlice.js

import { createSlice } from '@reduxjs/toolkit';

const supplierInfoSlice = createSlice({
  name: 'supplierInfo',
  initialState: {
    nomFournisseur: '',
    referenceFournisseur: '',
  },
  reducers: {
    setNomFournisseur: (state, action) => {
      state.nomFournisseur = action.payload;
    },
    setReferenceFournisseur: (state, action) => {
      state.referenceFournisseur = action.payload;
    },
  },
});

export const { setNomFournisseur, setReferenceFournisseur } = supplierInfoSlice.actions;
export default supplierInfoSlice.reducer;
