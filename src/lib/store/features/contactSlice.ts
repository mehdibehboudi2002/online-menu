import { createSlice } from '@reduxjs/toolkit';

interface ContactState {
  shouldHighlight: boolean;
}

const initialState: ContactState = {
  shouldHighlight: false,
};

const contactSlice = createSlice({
  name: 'contact',
  initialState,
  reducers: {
    triggerContactHighlight: (state) => {
      state.shouldHighlight = true;
    },
    resetContactHighlight: (state) => {
      state.shouldHighlight = false;
    },
  },
});

export const { triggerContactHighlight, resetContactHighlight } = contactSlice.actions;
export default contactSlice.reducer;