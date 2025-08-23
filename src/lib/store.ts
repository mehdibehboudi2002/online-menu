import { configureStore } from '@reduxjs/toolkit';
import cartReducer from './features/cartSlice';
import languageReducer from './features/languageSlice';
import themeReducer from './features/themeSlice';
import contactReducer from './features/contactSlice';

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    language: languageReducer,
    theme: themeReducer,
    contact: contactReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
