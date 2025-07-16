'use client';

import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import cartReducer from '../lib/features/cartSlice';
import languageReducer from '../lib/features/languageSlice';
import themeReducer from '../lib/features/themeSlice';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

interface ProvidersProps {
  children: React.ReactNode;
  initialLanguage: 'en' | 'fa'; 
}

export function Providers({ children, initialLanguage }: ProvidersProps) {
  const store = configureStore({
    reducer: {
      cart: cartReducer,
      language: languageReducer,
      theme: themeReducer,
    },
    preloadedState: {
      language: { language: initialLanguage },
    },
  });

  const queryClient = new QueryClient();

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </Provider>
  );
}
