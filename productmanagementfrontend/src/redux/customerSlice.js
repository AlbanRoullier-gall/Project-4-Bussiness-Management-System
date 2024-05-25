import { createSlice } from '@reduxjs/toolkit';

const customerSlice = createSlice({
  name: 'customers',
  initialState: {
    selectedClientId: '',
  },
  reducers: {
    setSelectedClientId: (state, action) => {
      state.selectedClientId = action.payload;
    },
  },
});

export const { setSelectedClientId} = customerSlice.actions;
export default customerSlice.reducer;
