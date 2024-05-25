// lineDetailsSlice.js
import { createSlice } from '@reduxjs/toolkit';

export const lineDetailsSlice = createSlice({
  name: 'lineDetails',
  initialState: [],
  reducers: {
    setLineDetails: (state, action) => {
      return action.payload;
    },
    updateLineDetail: (state, action) => {
      const { id } = action.payload;
      const index = state.findIndex(detail => detail.id === id);
      if (index !== -1) {
        state[index] = action.payload;
      }
    },
  },
});

export const { setLineDetails, updateLineDetail } = lineDetailsSlice.actions;

export default lineDetailsSlice.reducer;
