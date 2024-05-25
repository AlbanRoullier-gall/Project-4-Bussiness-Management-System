import { createSlice } from '@reduxjs/toolkit';

const signatureSlice = createSlice({
  name: 'signature',
  initialState: '',
  reducers: {
    updateSignature: (_, action) => {
      return action.payload; 
    },
    clearSignature: (_) => {
      return ''; 
    },
  },
});

export const { updateSignature, clearSignature } = signatureSlice.actions;
export default signatureSlice.reducer;
