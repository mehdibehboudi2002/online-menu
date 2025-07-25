'use client';

import { Provider, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect } from 'react';
import cartReducer from '../lib/features/cartSlice';
import languageReducer from '../lib/features/languageSlice';
import themeReducer from '../lib/features/themeSlice';
import { RootState } from '@/lib/store';

interface ProvidersProps {
  children: React.ReactNode;
  initialLanguage: 'en' | 'fa'; 
}

// Theme handler component that uses Redux state
function ThemeHandler({ children }: { children: React.ReactNode }) {
  const dark = useSelector((state: RootState) => state.theme.dark);

  useEffect(() => {
    const root = document.documentElement;
    
    if (dark) {
      // Dark theme CSS variables
      root.style.setProperty('--bg-primary', '#14532d'); // green-950
      root.style.setProperty('--bg-gradient', '#14532d'); // solid dark background
      root.style.setProperty('--text-primary', '#99ceff');
    } else {
      // Light theme CSS variables
      root.style.setProperty('--bg-primary', '#f7fee7');
      root.style.setProperty('--bg-gradient', 'linear-gradient(to right, #f7fee7, #dcfce7, #f7fee7)'); // from-[#f7fee7] via-green-100 to-[#f7fee7]
      root.style.setProperty('--text-primary', '#14532d'); // green-950
    }
  }, [dark]);

  return <>{children}</>;
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
        <ThemeHandler>
          {children}
        </ThemeHandler>
      </QueryClientProvider>
    </Provider>
  );
}