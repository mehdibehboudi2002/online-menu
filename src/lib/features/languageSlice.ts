import { createSlice } from '@reduxjs/toolkit';

interface LanguageState {
  language: 'en' | 'fa';
}

const initialState: LanguageState = {
  language: 'en',
};

export const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    toggleLanguage: (state) => {
      state.language = state.language === 'en' ? 'fa' : 'en';
    },
    setLanguage: (state, action) => {
      state.language = action.payload;
    },
  },
});

export const { toggleLanguage, setLanguage } = languageSlice.actions;

export default languageSlice.reducer;
