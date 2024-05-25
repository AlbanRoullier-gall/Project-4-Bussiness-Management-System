import { createSlice } from '@reduxjs/toolkit';

const BASE_BACKEND_URL = 'http://localhost:8000';
const fileSelectorSlice = createSlice({
  name: 'fileSelector',
  initialState: { fileName: null, fileURL: null, fileId: null }, 
  reducers: {
    setFileSelectorData: (state, action) => {
      return { fileName: action.payload.fileName, fileURL: action.payload.fileURL, fileId: state.fileId }; 
    },
    clearFileSelectorData: () => {
      return { fileName: null, fileURL: null, fileId: null }; 
    },
    setFileURL: (state, action) => {
      state.fileURL = action.payload ? `${BASE_BACKEND_URL}${action.payload}` : null;
    },
    setId: (state, action) => { 
      state.fileId = action.payload;
    },
  },
});

export const { setFileSelectorData, clearFileSelectorData, setFileURL, setId } = fileSelectorSlice.actions; 
export default fileSelectorSlice.reducer;
