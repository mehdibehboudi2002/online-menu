'use client';

import { Provider, useSelector } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useEffect, useState } from 'react'; 
import cartReducer from '../lib/features/cartSlice';
import languageReducer from '../lib/features/languageSlice';
import themeReducer from '../lib/features/themeSlice';
import contactReducer from '../lib/features/contactSlice'; // Add this import
import { RootState } from '@/lib/store';
import Line from '@/components/Line'; 

interface ProvidersProps {
  children: React.ReactNode;
  initialLanguage: 'en' | 'fa';
}

// Global Loading Spinner component
function GlobalLoadingSpinner() {
  return (
    <>
      <Line width='100vw' />
      <div className={`bg-[#f7fee7] font-cursive relative flex justify-center items-center h-screen`}>
        <div className="relative">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-6 h-6 bg-yellow-500 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </>
  );
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
      contact: contactReducer, // Add this line
    },
    preloadedState: {
      language: { language: initialLanguage },
    },
  });

  const queryClient = new QueryClient();

  // The state and the effect for handling the hydration-check loading state
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // This useEffect will run when `mounted` changes, handling the body class
  useEffect(() => {
    const body = document.body;
    
    // Add the class during the initial render state
    if (!mounted) {
      body.classList.add('overflow-y-scroll');
    } else {
      // Remove it after the app has mounted
      body.classList.remove('overflow-y-scroll');
    }

    // Cleanup function to ensure the class is removed if the component unmounts
    return () => {
      body.classList.remove('overflow-y-scroll');
    };
  }, [mounted]);

  return (
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <ThemeHandler>
          {/* Render the loading spinner if not mounted, otherwise render the children */}
          {!mounted ? <GlobalLoadingSpinner /> : children}
        </ThemeHandler>
      </QueryClientProvider>
    </Provider>
  );
}