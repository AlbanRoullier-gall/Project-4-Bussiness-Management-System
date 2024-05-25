import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  communication: '',
  structuredCommunication: '', 
};

const communicationBillSlice = createSlice({
  name: 'communicationBill',
  initialState,
  reducers: {
    updateCommunication: (state, action) => {
      state.communication = action.payload; 
    },
    updateStructuredCommunication: (state, action) => { 
      state.structuredCommunication = action.payload;
    },
  },
});

export const { updateCommunication, updateStructuredCommunication } = communicationBillSlice.actions;

export default communicationBillSlice.reducer;
